"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import styles from "./main.module.css";
import { ChangeEventHandler, useRef, useState } from "react";
import ChipsInput from "@/components/ui/chips-input";
import { axiosInstance } from "@/services/axios";
import { useAuthContext } from "@/contexts/auth";

const ReferralPostDialogContent = () => {
  const { register, setValue, formState, handleSubmit } = useForm();
  const { data: userData } = useAuthContext();
  const { isSubmitting, errors } = formState;
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      if (inputFieldValue < e.target.min) {
        return setValue(e.target.name, 0);
      }
      return setValue(e.target.name, Math.floor(Number(inputFieldValue)));
    }
  };
  const [skills, setSkills] = useState<string[]>([]);
  const skillsRef = useRef<HTMLInputElement>(null);
  const [skillsError, setSkillsError] = useState("");
  
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (skills.length === 0 && skillsRef.current) {
      setSkillsError("Minimum of one skill must be added.");
      return skillsRef.current.focus();
    }
    const dataToBeSubmitted = { ...data, skills, posted_by: userData.id };

    const formData = new FormData();
    for (const key in dataToBeSubmitted) {
      formData.append(key, dataToBeSubmitted[key]);
    }
    return axiosInstance.post("/posts/", formData);
  };

  return (
    <form
      className={styles.formContainer}
      id="post-referral"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.fieldContainer}>
        <label htmlFor="company_name" className={styles.labelContainer}>
          Company Name
        </label>
        <input
          id="company_name"
          placeholder="ABC"
          {...register("company_name", {
            required: "Company Name is a required field",
          })}
          className={styles.inputContainer}
        />
        {errors.company_name && <p>{errors.company_name.message}</p>}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="job_title" className={styles.labelContainer}>
          Job Title
        </label>
        <input
          id="job_title"
          placeholder="Write the role here"
          {...register("job_title", {
            required: "Job Title is a required field",
          })}
          className={styles.inputContainer}
        />
        {errors.job_title && <p>{errors.job_title.message}</p>}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="job_description" className={styles.labelContainer}>
          Job Description
        </label>
        <textarea
          id="job_description"
          placeholder="Write the requirement related to job here"
          className={`${styles.inputContainer} ${styles.textareaInput}`}
          {...register("job_description", {
            required: "Job Description is a required field",
          })}
        />
        {errors.job_description && <p>{errors.job_description.message}</p>}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="experience" className={styles.labelContainer}>
          Experience (in years)
        </label>
        <input
          id="experience"
          placeholder="3"
          className={styles.inputContainer}
          {...register("experience", {
            required: "Please share the experience requirements for the job!",
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
        {errors.experience && <p>{errors.experience.message}</p>}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="salary" className={styles.labelContainer}>
          Salary (in LPA)
        </label>
        <input
          id="salary"
          placeholder="12"
          className={styles.inputContainer}
          {...register("salary", {
            required: "Please share the salary details of the job!",
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
        {errors.salary && <p>{errors.salary.message}</p>}
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="expiry_date" className={styles.labelContainer}>
          Expiry Date
        </label>
        <input
          id="expiry_date"
          className={styles.inputContainer}
          {...register("expiry_date", {
            required: "Please mention the date of expiry for the application!",
          })}
          type="date"
        />
        {errors.expiry_date && <p>{errors.expiry_date.message}</p>}
      </div>
      <div className={styles.fieldContainer} ref={skillsRef}>
        <label htmlFor="skills" className={styles.labelContainer}>
          Skills
        </label>
        <div className="col-span-2 justify-end">
          <ChipsInput chips={skills} setChips={setSkills} ref={skillsRef} />
        </div>
        {skillsError && <p>{skillsError}</p>}
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
          })}
          className={styles.inputContainer}
        />
        {errors.location && <p>{errors.location.message}</p>}
      </div>
      <button
        className={styles.formSubmitBtn}
        disabled={isSubmitting}
        type="submit"
        form="post-referral"
      >
        Post
      </button>
    </form>
  );
};

export default ReferralPostDialogContent;
