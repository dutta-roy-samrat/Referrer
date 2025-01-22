import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { AxiosError } from "axios";
import snakeCase from "lodash/snakeCase";

import { axiosInstance } from "@/services/axios";
import { onErrorToastMsg } from "@/services/toastify";

import { Dialog } from "@/components/ui/dialog";
import CustomFileInput from "@/components/ui/custom-file-input";
import ErrorMessage from "@/components/shared/error-message";
import ProfileImageUploader from "./image-uploader";
import AuthFormLayout from "@/components/auth-form-layout";

import { useCurrentDeviceContext } from "@/contexts/device";
import { useAuthContext, AuthDataType } from "@/contexts/auth";

import { fetchUserInfo } from "@/graphql/query/user-details";
import { fetchFile } from "@/action/file";
import { getFileUrl } from "@/helpers/utils";

import styles from "./main.module.css";
import PageLoader from "@/components/ui/loader/page-loader";
import { fetchApplicationInfo } from "@/graphql/query/application-info";
import NDotsLoader from "@/components/ui/loader/n-dots";

export type FormState = {
  firstName: string;
  lastName: string;
  experience: number;
  resume: File | null;
  profileImage: string;
};

export type FormErrors = {
  firstName?: string;
  lastName?: string;
  experience?: string;
  resume?: string;
  profileImage?: string;
};

type FormSubmissionData = Partial<
  Omit<FormState, "profileImage"> & { profileImage: File | null }
>;

const defaultFormValues: FormState = {
  firstName: "",
  lastName: "",
  experience: 0,
  resume: null,
  profileImage: "",
};

const ProfileSettings = () => {
  const { data, loading } = useQuery(fetchApplicationInfo);
  const { isDesktop, isResponsive } = useCurrentDeviceContext();
  const { setAuthenticationData, data: authData, isLoading } = useAuthContext();

  const [formData, setFormData] = useState<FormState>(defaultFormValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageSrc, setImageSrc] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmedFile, setConfirmedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] =
    useState<FormState>(defaultFormValues);
  const [isFormUILoading, setIsFormUILoading] = useState(true);

  const { firstName, lastName, profileImage, resume, experience } = formData;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName) {
      newErrors.firstName = "First Name is a required field";
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is a required field";
    }

    if (experience < 0) {
      newErrors.experience = "Experience cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const numValue = Math.max(0, Math.floor(Number(value)));
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const getDirtiedFields = () => {
    const dirtyFields: (keyof FormState)[] = [];
    Object.keys(formData).forEach((field) => {
      if (
        initialFormData[field as keyof FormState] !==
        formData[field as keyof FormState]
      ) {
        dirtyFields.push(field as keyof FormState);
      }
    });
    return dirtyFields;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const dataToBeSubmitted: FormSubmissionData = {};
    const dirtyFields = getDirtiedFields();

    dirtyFields.forEach((field) => {
      if (field === "profileImage") {
        dataToBeSubmitted[field] = confirmedFile;
      } else {
        dataToBeSubmitted[field] = formData[field];
      }
    });

    const formDataToSubmit = new FormData();
    for (const key in dataToBeSubmitted) {
      if (dataToBeSubmitted[key as keyof FormSubmissionData] !== null) {
        formDataToSubmit.append(snakeCase(key), dataToBeSubmitted[key]);
      }
    }

    try {
      await axiosInstance.patch("/auth/update-details/", formDataToSubmit);
      setInitialFormData((prevData) => ({
        ...prevData,
        ...dataToBeSubmitted,
        profileImage,
      }));
      setAuthenticationData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          ...formData,
        },
      }));
    } catch (error) {
      onErrorToastMsg(
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Failed to update profile",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isFormUILoading) return;
    if (data?.getUserDetails && !loading && !isLoading) {
      const { getUserDetails } = data;

      Object.keys(formData).forEach((key) => {
        const fieldKey = key as keyof AuthDataType;
        const fetchedData = getUserDetails[fieldKey] || authData[fieldKey];
        if (
          fetchedData &&
          (fieldKey === "resume" || fieldKey === "profileImage")
        ) {
          const splitBy =
            fieldKey === "resume" ? "resumes/" : "profile_images/";
          const fileName = fetchedData.split(splitBy)[1];
          const { pathname } = new URL(
            fetchedData,
            "http://localhost:8000/media/",
          );
          console.log(pathname.slice(1));
          return fetchFile({ data: pathname.slice(1), fileName }).then(
            (res) => {
              let value: File | undefined | string = res;
              if (fieldKey === "profileImage") {
                console.log(res, "kklop");
                const blobUrl = URL.createObjectURL(res as File);
                setConfirmedFile(res as File);
                setImageSrc(blobUrl);
                value = blobUrl;
              }
              setFormData((prev) => ({ ...prev, [fieldKey]: value }));
              setInitialFormData((prevData) => ({
                ...prevData,
                [fieldKey]: value,
              }));
            },
          );
        }
        setFormData((prev) => ({ ...prev, [fieldKey]: fetchedData }));
        return setInitialFormData((prevData) => ({
          ...prevData,
          [fieldKey]: fetchedData,
        }));
      });
      setIsFormUILoading(false);
    }
  }, [loading, isLoading]);

  const resumeUrl = getFileUrl(resume);
  const isBtnDisabled = getDirtiedFields().length === 0 || isSubmitting;
  if (isFormUILoading) return <PageLoader />;
  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <h1 className="m-5 text-3xl font-bold">Update Profile</h1>
        <AuthFormLayout cardClass="bg-white">
          <div className={styles.formContainer}>
            <ProfileImageUploader
              imageSrc={imageSrc}
              setProfileImage={(imgSrc) => {
                setFormData((prevData) => ({
                  ...prevData,
                  profileImage: imgSrc,
                }));
              }}
              setConfirmedFile={setConfirmedFile}
              setSelectedFile={setSelectedFile}
              selectedFile={selectedFile}
              confirmedFile={confirmedFile}
              profileImage={profileImage}
              setImageSrc={setImageSrc}
            />

            <div className={styles.nameFieldContainer}>
              <div className={styles.fieldContainer}>
                <label htmlFor="firstName" className={styles.labelContainer}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={handleInput}
                  className={`${styles.inputContainer} ${errors.firstName ? styles.errorInput : ""}`}
                />
                {isResponsive && errors.firstName && (
                  <p className={styles.error}>{errors.firstName}</p>
                )}
              </div>

              <div className={styles.fieldContainer}>
                <label htmlFor="lastName" className={styles.labelContainer}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={handleInput}
                  className={`${styles.inputContainer} ${errors.lastName ? styles.errorInput : ""}`}
                />
                {isResponsive && errors.lastName && (
                  <p className={styles.error}>{errors.lastName}</p>
                )}
              </div>
            </div>

            {isDesktop && (errors.lastName || errors.firstName) && (
              <div className={styles.nameFieldContainer}>
                {errors.firstName && (
                  <p className={styles.error}>{errors.firstName}</p>
                )}
                {errors.lastName && (
                  <p className={styles.error}>{errors.lastName}</p>
                )}
              </div>
            )}

            <label>Resume</label>
            <CustomFileInput
              file={resume}
              fileUrl={resumeUrl}
              inputProps={{
                accept: ".pdf,.doc,.docx",
                onChange: handleFileInput,
              }}
              inputId="resume"
              labelText="Update your resume"
            />
            {errors.resume && (
              <ErrorMessage
                error={errors.resume}
                className={styles.errorText}
              />
            )}

            <div className={styles.fieldContainer}>
              <label htmlFor="experience" className={styles.labelContainer}>
                Experience (in years)
              </label>
              <input
                id="experience"
                name="experience"
                type="number"
                min={0}
                placeholder="3"
                value={experience}
                onChange={handleInput}
                className={`${styles.inputContainer} ${errors.experience ? styles.errorInput : ""}`}
              />
              {errors.experience && (
                <p className={styles.error}>{errors.experience}</p>
              )}
            </div>

            <button
              type="submit"
              className={`${styles.signUpBtn} ${isBtnDisabled ? styles.disabledBtn : ""}`}
              disabled={isBtnDisabled}
            >
              {isSubmitting ? <NDotsLoader /> : "Save Changes"}
            </button>
          </div>
        </AuthFormLayout>
      </form>
    </Dialog>
  );
};

export default ProfileSettings;
