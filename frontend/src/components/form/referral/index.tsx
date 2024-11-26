"use client";

import { useForm } from "react-hook-form";

import styles from "./main.module.css";
import { ChangeEventHandler, useRef, useState } from "react";
import ChipsInput from "@/components/ui/chips-input";
import { axiosInstance } from "@/services/axios";
import { useAuthContext } from "@/contexts/auth";

const ReferralForm = () => {
  const { register, setValue, formState, handleSubmit } = useForm();
  const { data: userData } = useAuthContext()
  const { isSubmitting, errors, } = formState;
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputFieldValue = e.target.value;
    if (e.target.type === "number") {
      if (inputFieldValue < e.target.min) {
        return setValue(e.target.name, 0);
      }
      return setValue(e.target.name, Math.floor(Number(inputFieldValue)));
    }
  };
  const [skills, setSkills] = useState([]);
  const skillsRef = useRef(null);
  const [skillsError, setSkillsError] = useState("");
  console.log(skills)
  const onSubmit = (data) => {
    if (skills.length === 0 && skillsRef.current) {
      setSkillsError("Minimum of one skill must be added.")
      return skillsRef.current.focus();
    }
    const dataToBeSubmitted = { ...data, skills, posted_by: userData.id }

    const formData = new FormData();
    for (const key in dataToBeSubmitted) {
      formData.append(key, dataToBeSubmitted[key])
    }
    return axiosInstance.post("/posts/", formData)
  }
  return (
    <form className={styles.formContainer} id="post-referral" onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.fieldContainer}>
        <label htmlFor="company_name" className={styles.labelContainer}>
          Company Name
        </label>
        <input
          id="company_name"
          placeholder="ABC"
          {...register("company_name", {
            required: {
              value: true,
              message: "Company Name is a required field",
            },
          })}
          className={styles.inputContainer}
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="job_title" className={styles.labelContainer}>
          Job Title
        </label>
        <input
          id="job_title"
          placeholder="Write the role here"
          {...register("job_title", {
            required: {
              value: true,
              message: "Job Title is a required field",
            },
          })}
          className={styles.inputContainer}
        />
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
            required: {
              value: true,
              message: "Job Descrition is a required field",
            },
          })}
        />
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="experience_in_years" className={styles.labelContainer}>
          Experience (in years)
        </label>
        <input
          id="experience_in_years"
          placeholder="3"
          className={styles.inputContainer}
          {...register("experience_in_years", {
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
        <label htmlFor="salary_in_lpa" className={styles.labelContainer}>
          Salary (in LPA)
        </label>
        <input
          id="salary_in_lpa"
          placeholder="12"
          className={styles.inputContainer}
          {...register("salary_in_lpa", {
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
        <label htmlFor="expiry_date" className={styles.labelContainer}>
          Exipry Date
        </label>
        <input
          id="expiry_date"
          className={styles.inputContainer}
          {...register("expiry_date", {
            required: {
              value: true,
              message:
                "Please mention the date of expiry for the application !",
            },
          })}
          type="date"
        />
      </div>
      <div className={styles.fieldContainer} ref={skillsRef}>
        <label htmlFor="skills" className={styles.labelContainer}>
          <div>Skills</div>
        </label>
        {/* <input
          id="skills"
          placeholder="Mention the skills required for the job"
          className={`${styles.inputContainer} ${styles.textareaInput}`}
          {...register("skills", {
            required: {
              value: true,
              message: "Please list the skills required for the job !",
            },
          })}
        /> */}
        <div className="justify-end col-span-2">
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
            required: {
              value: true,
              message: "Job Location is a required field",
            },
          })}
          className={styles.inputContainer}
        />
      </div>
      <button
        type="submit"
        className={styles.formSubmitBtn}
        disabled={isSubmitting}
      >
        Post
      </button>
    </form>
  );
};

export default ReferralForm;
