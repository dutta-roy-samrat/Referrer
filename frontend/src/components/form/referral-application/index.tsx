"use client";

import {
  useEffect,
  FC,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
} from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { AxiosError } from "axios";

import CustomFileInput from "@/components/ui/custom-file-input";
import ErrorMessage from "@/components/shared/error-message";
import StyledButton from "@/components/ui/button/styled-button";

import { fetchApplicationInfo } from "@/graphql/query/application-info";
import { axiosInstance } from "@/services/axios";
import { useAuthContext } from "@/contexts/auth";
import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";
import { fetchFile } from "@/action/file";
import { formDataSerializer } from "@/helpers/serializers";
import { getInputClass } from "@/helpers/utils";

import { MEDIA_LIBRARY_URL } from "@/constants/environment-variables";

import styles from "./main.module.css";

type FormFieldType = "resume" | "experience";
type ReferralApplicationFormProps = {
  id: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

type FormState = { experience: number; resume: File[] | null };

const DEFAULT_FORM_VALUES = {
  experience: 0,
  resume: null,
};

const ReferralApplicationForm: FC<ReferralApplicationFormProps> = ({
  id,
  setIsModalOpen,
}) => {
  const { data, loading } = useQuery(fetchApplicationInfo);
  const { setAuthenticationData, data: authData, isLoading } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormState>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const resumeFile = watch("resume")?.[0] || authData?.resume;

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      const numberValue =
        inputFieldValue === "" ? 0 : Math.floor(Number(inputFieldValue));
      if (numberValue < Number(e.target.min)) {
        return setValue(e.target.name as FormFieldType, 0);
      }
      return setValue(e.target.name as FormFieldType, numberValue, {
        shouldValidate: true,
      });
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

    const formData = formDataSerializer({ ...data, resume: resumeFile });
    formData.append("post_id", id);

    try {
      const res = await axiosInstance.post("/posts/apply/", formData);
      onSuccessToastMsg(res.data.message);
      setIsModalOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      onErrorToastMsg(
        (err?.response?.data as { message: string })?.message || err.message,
      );
    }
  };

  const resumeUrl = resumeFile ? URL.createObjectURL(resumeFile) : "";

  useEffect(() => {
    if (data?.getUserDetails && !loading && !isLoading) {
      const { getUserDetails } = data;

      Object.keys(DEFAULT_FORM_VALUES).forEach((key) => {
        const fieldKey = key as keyof FormState;
        const fetchedData = authData[fieldKey] || getUserDetails[fieldKey];
        if (fetchedData && fieldKey === "resume") {
          if (authData[fieldKey])
            return setValue(fieldKey, [fetchedData] as File[]);
          const fileName = fetchedData.split("resumes/")[1];
          const { pathname } = new URL(fetchedData, MEDIA_LIBRARY_URL);
          return fetchFile({ data: pathname.slice(1), fileName }).then(
            (res) => {
              setValue(fieldKey, [res] as File[]);
            },
          );
        }
        setValue(fieldKey, fetchedData);
      });
    }
  }, [loading, data, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.formContainer}
      id="referral-application"
    >
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
        className=""
      />
      {errors.resume && (
        <ErrorMessage
          error={errors.resume?.message}
          className={styles.errorText}
        />
      )}

      <div className={styles.fieldContainer}>
        <label htmlFor="experience" className={styles.labelContainer}>
          Experience (in years)
        </label>
        <input
          id="experience"
          placeholder="3"
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.experience,
          })}
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
          <ErrorMessage
            error={errors.experience?.message}
            className={styles.errorText}
          />
        )}
      </div>
      <StyledButton form="referral-application" disabled={isSubmitting}>
        Apply
      </StyledButton>
    </form>
  );
};

export default ReferralApplicationForm;
