"use client";

import dynamic from "next/dynamic";

import {
  ChangeEventHandler,
  Dispatch,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import ChipsInput from "@/components/ui/chips-input";
import StyledButton from "@/components/ui/button/styled-button";

import { axiosInstance } from "@/services/axios";
import { useAuthContext } from "@/contexts/auth";
import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";

import { formDataSerializer } from "@/helpers/serializers";
import { getInputClass } from "@/helpers/utils";
import { cn } from "@/lib/utils";

import styles from "./main.module.css";

const DatePicker = dynamic(() => import("@/components/ui/date-picker-input"));

const ReferralPostDialogContent = ({
  setIsFormDialogOpen,
}: {
  setIsFormDialogOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { push } = useRouter();
  const { register, setValue, formState, handleSubmit } = useForm();
  const { data: userData, isAuthenticated } = useAuthContext();
  const { isSubmitting, errors } = formState;

  const [skills, setSkills] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [skillsError, setSkillsError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");

  const skillsRef = useRef<HTMLInputElement>(null);
  const expiryDateInputRef = useRef<HTMLButtonElement>(null);

  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      if (inputFieldValue < e.target.min) {
        return setValue(e.target.name, 0);
      }
      return setValue(e.target.name, Math.floor(Number(inputFieldValue)), {
        shouldValidate: true,
      });
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setSkillsError("");
    if (!isAuthenticated) {
      push("/login");
    }
    const dataToBeSubmitted = {
      ...data,
      skills,
      expiryDate: expiryDate?.toLocaleDateString("en-ca", {
        timeZone: "UTC",
      }),
      posted_by: userData.id,
    };
    const formData = formDataSerializer(dataToBeSubmitted);
    return axiosInstance
      .post("/posts/", formData)
      .then(({ data }) => {
        onSuccessToastMsg(data.message);
        setIsFormDialogOpen?.(false);
      })
      .catch((err) => onErrorToastMsg(err.message));
  };

  const handleSubmitBtnClick = () => {
    if (skills.length === 0 && skillsRef.current) {
      setSkillsError("Minimum of one skill must be added.");
      skillsRef.current.focus();
    }
    if (!expiryDate && expiryDateInputRef.current) {
      setExpiryDateError("Add an expiry date for the opening.");
      expiryDateInputRef.current.focus();
    }
    return;
  };

  return (
    <form
      className={styles.formContainer}
      id="post-referral"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.fieldContainer}>
        <label htmlFor="companyName" className={styles.labelContainer}>
          Company Name
        </label>
        <input
          id="companyName"
          placeholder="ABC"
          {...register("companyName", {
            required: "Company Name is a required field",
          })}
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.companyName,
          })}
        />
        {errors.companyName && (
          <p className={styles.error}>
            {errors.companyName.message as ReactNode}
          </p>
        )}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="jobTitle" className={styles.labelContainer}>
          Job Title
        </label>
        <input
          id="jobTitle"
          placeholder="Write the role here"
          {...register("jobTitle", {
            required: "Job Title is a required field",
            maxLength: {
              value: 25,
              message: "Max Limit 25 characters including space",
            },
          })}
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.jobTitle,
          })}
        />
        {errors.jobTitle && (
          <p className={styles.error}>{errors.jobTitle.message as ReactNode}</p>
        )}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="jobDescription" className={styles.labelContainer}>
          Job Description
        </label>
        <textarea
          id="jobDescription"
          placeholder="Write the requirement related to job here"
          className={getInputClass({
            className: cn(styles.inputContainer, styles.textareaInput),
            error: errors.companyName,
          })}
          {...register("jobDescription", {
            required: "Job Description is a required field",
          })}
        />
        {errors.jobDescription && (
          <p className={styles.error}>
            {errors.jobDescription.message as ReactNode}
          </p>
        )}
      </div>
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
            required: "Please share the experience requirements for the job!",
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
        {errors.experience && (
          <p className={styles.error}>
            {errors.experience.message as ReactNode}
          </p>
        )}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="salary" className={styles.labelContainer}>
          Salary (in LPA)
        </label>
        <input
          id="salary"
          placeholder="12"
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.salary,
          })}
          {...register("salary", {
            required: "Please share the salary details of the job!",
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
        {errors.salary && (
          <p className={styles.error}>{errors.salary.message as ReactNode}</p>
        )}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="expiryDate" className={styles.labelContainer}>
          Expiry Date
        </label>
        <DatePicker
          id="expiryDate"
          className={getInputClass({
            className: styles.inputContainer,
            error: !!expiryDateError && !expiryDate,
          })}
          date={expiryDate}
          setDate={setExpiryDate}
          ref={expiryDateInputRef}
        />
        {expiryDateError && !expiryDate && (
          <p className={styles.error}>{expiryDateError}</p>
        )}
      </div>
      <div className={styles.fieldContainer} ref={skillsRef}>
        <label htmlFor="skills" className={styles.labelContainer}>
          Skills
        </label>
        <div className={styles.skillsInputContainer}>
          <ChipsInput
            chips={skills}
            setChips={setSkills}
            ref={skillsRef}
            checkErrors={!!skillsError}
          />
        </div>
        {skillsError && !skills.length && (
          <p className={styles.error}>{skillsError}</p>
        )}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="location" className={styles.labelContainer}>
          Job Location
        </label>
        <input
          id="location"
          placeholder="Bangalore"
          {...register("location", {
            required: "Job Location is a required field",
            maxLength: {
              value: 15,
              message: "Max Limit 15 characters including space",
            },
          })}
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.location,
          })}
        />
        {errors.location && (
          <p className={styles.error}>{errors.location.message as ReactNode}</p>
        )}
      </div>
      <StyledButton
        className={styles.formSubmitBtn}
        disabled={isSubmitting}
        form="post-referral"
        loading={isSubmitting}
        onClick={handleSubmitBtnClick}
      >
        Post
      </StyledButton>
    </form>
  );
};

export default ReferralPostDialogContent;
