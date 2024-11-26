"use client";

import { useForm } from "react-hook-form";

import styles from "./main.module.css";
import { ChangeEventHandler } from "react";

const ReferralForm = () => {
  const { register, setValue } = useForm();
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      if (inputFieldValue < e.target.min) {
        return setValue(e.target.name, 0);
      }
      return setValue(e.target.name, Math.floor(Number(inputFieldValue)));
    }
  };
  return (
    <form className={styles.formContainer} id="post-referral">
      <div className={styles.fieldContainer}>
        <label htmlFor="company" className={styles.labelContainer}>
          Company Name
        </label>
        <input
          id="company"
          placeholder="ABC"
          {...register("company", {
            required: {
              value: true,
              message: "Company Name is a required field",
            },
          })}
          className={styles.inputContainer}
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="job-title" className={styles.labelContainer}>
          Job Title
        </label>
        <input
          id="job-title"
          placeholder="Write the role here"
          {...register("job-title", {
            required: {
              value: true,
              message: "Job Title is a required field",
            },
          })}
          className={styles.inputContainer}
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="job-description" className={styles.labelContainer}>
          Job Description
        </label>
        <textarea
          id="job-description"
          placeholder="Write the requirement related to job here"
          className={`${styles.inputContainer} ${styles.textareaInput}`}
          {...register("job-description", {
            required: {
              value: true,
              message: "Job Descrition is a required field",
            },
          })}
        />
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
            required: {
              value: true,
              message: "Please share the experience requirements for the job !",
            },
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
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
            required: {
              value: true,
              message: "Please share the salary details of the job !",
            },
          })}
          type="number"
          min={0}
          onChange={handleInput}
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="expiry" className={styles.labelContainer}>
          Exipry Date
        </label>
        <input
          id="expiry"
          className={styles.inputContainer}
          {...register("expiry", {
            required: {
              value: true,
              message:
                "Please mention the date of expiry for the application !",
            },
          })}
          type="date"
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="skills" className={styles.labelContainer}>
          Skills
        </label>
        <textarea
          id="skills"
          placeholder="Mention the skills required for the job"
          className={`${styles.inputContainer} ${styles.textareaInput}`}
          {...register("skills", {
            required: {
              value: true,
              message: "Please list the skills required for the job !",
            },
          })}
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="location" className={styles.labelContainer}>
          Job Location
        </label>
        <input
          id="location"
          placeholder="Bangalore"
          {...register("location", {
            required: {
              value: true,
              message: "Job Location is a required field",
            },
          })}
          className={styles.inputContainer}
        />
      </div>
    </form>
  );
};

export default ReferralForm;
