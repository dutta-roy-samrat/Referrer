"use client";

import CustomFileInput from "@/components/ui/custom-file-input";
import { ChangeEventHandler, FC, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import snakeCase from "lodash/snakeCase";

import styles from "./main.module.css";
import { fetchApplicationInfo } from "@/graphql/query/application-info";
import { axiosInstance } from "@/services/axios";
import { useAuthContext } from "@/contexts/auth";
import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";
import { AxiosError } from "axios";
import { fetchFile } from "@/action/file";

type FormFields = "resume" | "experience";
type ReferralApplicationFormProps = {
  id: string;
};

const ReferralApplicationForm: FC<ReferralApplicationFormProps> = ({ id }) => {
  const { data, loading } = useQuery(fetchApplicationInfo);
  const { setAuthenticationData, data: authData } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (
      data?.getUserDetails &&
      !loading &&
      !(authData.resume || authData.experience)
    ) {
      const { getUserDetails } = data;
      Object.keys(getUserDetails).forEach((key) => {
        const fieldKey = snakeCase(key) as FormFields;
        const fetchedData = getUserDetails[fieldKey];
        if (fetchedData && key === "resume") {
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
  }, [loading, data, setValue]);

  const resumeFile = watch("resume")?.[0] || authData?.resume;

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      const numberValue =
        inputFieldValue === "" ? 0 : Math.floor(Number(inputFieldValue));
      if (numberValue < Number(e.target.min)) {
        return setValue(e.target.name as FormFields, 0);
      }
      return setValue(e.target.name as FormFields, numberValue);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setAuthenticationData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        resume: resumeFile,
        experience: data.experience,
      },
    }));

    const formData = new FormData();
    formData.append("post_id", id);
    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {
      const res = await axiosInstance.post("/posts/apply/", formData);
      onSuccessToastMsg(res.data.message);
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error submitting application:", error);
      onErrorToastMsg(err.message);
    }
  };

  const resumeUrl = resumeFile ? URL.createObjectURL(resumeFile) : "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <label>Resume</label>
      <CustomFileInput
        file={resumeFile}
        fileUrl={resumeUrl}
        inputProps={{
          accept: ".pdf,.doc,.docx",
          ...register("resume", {
            required: "Resume is required",
            validate: (fileList) =>
              !!fileList?.length || "Please upload your resume",
          }),
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
            required: "Experience is required",
            min: { value: 0, message: "Experience cannot be negative" },
            validate: (value) =>
              value >= 0 || "Please enter a valid number of years",
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
        {errors.experience && (
          <p className={styles.errorText}>{errors.experience.message}</p>
        )}
      </div>

      <button className={styles.formSubmitBtn}>Apply</button>
    </form>
  );
};

export default ReferralApplicationForm;
