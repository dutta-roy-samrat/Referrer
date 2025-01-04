import React, {
  ChangeEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Image from "next/image";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ImageCropperModalContent from "@/components/account-settings/profile/image-cropper";
import CustomFileInput from "@/components/ui/custom-file-input";
import { useCurrentDeviceContext } from "@/contexts/device";

import styles from "./main.module.css";
import AuthFormLayout from "@/components/auth-form-layout";
import { useQuery } from "@apollo/client";
import { fetchUserInfo } from "@/graphql/query/user-details";
import snakeCase from "lodash/snakeCase";
import { AuthDataType, useAuthContext } from "@/contexts/auth";
import { fetchFile } from "@/action/file";
import { getFileUrl } from "@/helpers/utils";
import { axiosInstance } from "@/services/axios";

const ProfileSettings = () => {
  const { data, loading } = useQuery(fetchUserInfo);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [profileImage, setProfileImage] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmedFile, setConfirmedFile] = useState<File | null>(null);
  const { isDesktop, isResponsive } = useCurrentDeviceContext();
  const { setAuthenticationData, data: authData } = useAuthContext();
  const resumeFile = watch("resume")?.[0] || authData?.resume;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImageUploaded = () => {
    setConfirmedFile(null);
    setImageSrc("");
    setProfileImage("");
  };

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      if (inputFieldValue < e.target.min) {
        return setValue(e.target.name, 0);
      }
      return setValue(e.target.name, Math.floor(Number(inputFieldValue)));
    }
  };

  const getInputClassName = (errorField: string) =>
    `${styles.inputContainer} ${errors[errorField] ? styles.errorInput : ""}`;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(profileImage,
      "kklo",
    );
    const dataToBeSubmitted = {
      ...data,
      profileImage,
    };
    const formData = new FormData();
    for (const key in dataToBeSubmitted) {
      if (key === "profileImage") {
        formData.append(
          snakeCase(key),
          dataToBeSubmitted[key],
          confirmedFile?.name,
        );
        continue;
      }
      formData.append(snakeCase(key), dataToBeSubmitted[key]);
    }

    axiosInstance
      .patch("/auth/update-details/", formData)
      .then(() => {
        setAuthenticationData?.((prevData) => ({
          ...prevData,
          data: {
            ...prevData.data,
            ...data,
          },
        }));
      })
      .catch((error) => console.error("Error:", error));
  };
  useEffect(() => {
    if (data?.getUserDetails && !loading) {
      const { getUserDetails } = data;
      Object.keys(getUserDetails).forEach((key) => {
        const fieldKey = key as keyof AuthDataType;
        const fetchedData = getUserDetails[fieldKey];
        if (fetchedData && (key === "resume" || key === "profileImage")) {
          const fileName = fetchedData.split("resumes/")[1];
          return fetchFile({ data: getUserDetails[fieldKey], fileName }).then(
            (res) => {
              setValue(fieldKey, res as File);
              setAuthenticationData((prevData) => ({
                ...prevData,
                data: {
                  ...prevData.data,
                  resume: res as File,
                },
              }));
            },
          );
        }
        setValue(fieldKey, authData[fieldKey] || getUserDetails[fieldKey]);
        if (authData[fieldKey]) return;
        setAuthenticationData((prevData) => ({
          ...prevData,
          data: {
            ...prevData.data,
            [fieldKey]: authData[fieldKey] || getUserDetails[fieldKey],
          },
        }));
      });
    }
  }, [loading, data]);

  const resumeUrl = getFileUrl(resumeFile);

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="m-5 text-3xl font-bold">Update Profile</h1>
        <AuthFormLayout cardClass="bg-white">
          <div className={styles.formContainer}>
            <div className="flex items-center justify-start gap-3">
              <div>
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    className="flex h-44 w-44 items-center justify-center rounded-full"
                    width="100"
                    height="100"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <CustomFileInput
                fileUrl={profileImage}
                file={confirmedFile}
                handleInputChange={handleImageUpload}
                label={
                  <DialogTrigger>
                    <label
                      htmlFor="profileImage"
                      className="rounded-lg bg-black p-2 text-white"
                    >
                      Choose a file
                    </label>
                  </DialogTrigger>
                }
                inputId="profileImage"
                className="flex-col items-start justify-center gap-3"
                inputProps={{ accept: "image/*" }}
              />
            </div>

            {imageSrc && (
              <ImageCropperModalContent
                imageSrc={imageSrc}
                setProfileImage={setProfileImage}
                setImageSrc={setImageSrc}
                setConfirmedFile={setConfirmedFile}
                setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
              />
            )}

            <div className={styles.nameFieldContainer}>
              <div className={styles.fieldContainer}>
                <label htmlFor="firstName" className={styles.labelContainer}>
                  First Name
                </label>
                <input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: "First Name is a required field",
                    },
                  })}
                  className={getInputClassName("firstName")}
                />
                {isResponsive && errors.firstName && (
                  <p className={styles.error}>
                    {errors.firstName?.message as ReactNode}
                  </p>
                )}
              </div>
              <div className={styles.fieldContainer}>
                <label htmlFor="lastName" className={styles.labelContainer}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", {
                    required: {
                      value: true,
                      message: "Last Name is a required field",
                    },
                  })}
                  className={getInputClassName("lastName")}
                />
                {isResponsive && errors.lastName && (
                  <p className={styles.error}>
                    {errors.lastName?.message as ReactNode}
                  </p>
                )}
              </div>
            </div>
            {isDesktop && (errors.lastName || errors.firstName) && (
              <div className={styles.nameFieldContainer}>
                <p className={styles.error}>
                  {errors.firstName?.message as ReactNode}
                </p>
                <p className={styles.error}>
                  {errors.lastName?.message as ReactNode}
                </p>
              </div>
            )}
            <label>Resume</label>
            <CustomFileInput
              file={resumeFile}
              fileUrl={resumeUrl}
              inputProps={{
                accept: ".pdf,.doc,.docx",
                ...register("resume"),
              }}
              inputId="resume"
              labelText="Update your resume"
            />
            {errors.resume && (
              <p className={styles.errorText}>{errors.resume.message}</p>
            )}

            <div className={styles.fieldContainer}>
              <label htmlFor="experience" className={styles.labelContainer}>
                Experience (in years)
              </label>
              <input
                id="experience"
                placeholder="3"
                className={styles.inputContainer}
                {...register("experience", {
                  required: {
                    value: true,
                    message:
                      "Please share the experience requirements for the job !",
                  },
                })}
                type="number"
                min={0}
                onChange={handleInput}
              />
            </div>

            <button type="submit" className={styles.signUpBtn}>
              Save Changes
            </button>
          </div>
        </AuthFormLayout>
      </form>
    </Dialog>
  );
};

export default ProfileSettings;
