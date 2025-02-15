"use client";

import { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import SackDollarIcon from "@/components/ui/icons/sack-dollar";
import UserTieIcon from "@/components/ui/icons/user-tie";
import ClockIcon from "@/components/ui/icons/clock";
import LocationIcon from "@/components/ui/icons/location";
import ArrowOnHover from "@/components/ui/interactive-arrow-on-hover";
import JobField from "@/components/post/shared/job-field";
import Skills from "@/components/post/shared/skills";
import { PostProps } from "@/components/post/types";
import ReferralApplicationForm from "@/components/form/referral-application";
import StyledButton from "@/components/ui/button/styled-button";

import styles from "./main.module.css";
import AppliedByList from "@/components/post/applied-by-list";

const defaultArr: any[] = [];

export type AppliedByType = {
  id: number;
  first_name: string;
  last_name: string;
  resume: string;
  experience: number;
};

const JobDescriptionPage: FC<
  PostProps & {
    view_only: boolean;
    applied_by?: AppliedByType[];
  }
> = ({
  skills_display = [],
  experience,
  expiry_date,
  job_title,
  company_name,
  salary,
  location,
  id,
  job_description,
  view_only,
  applied_by = defaultArr,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const renderApplyCta = () => (
    <div className={styles.dialogContainer}>
      <Dialog open={isModalOpen}>
        <ArrowOnHover
          text="Apply Here"
          Component={StyledButton}
          onClick={handleModalOpen}
        />
        <DialogContent onClose={handleModalClose}>
          <DialogTitle>Application Form</DialogTitle>
          <ReferralApplicationForm id={id} setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContent}>
        <h1 className={styles.jobTitle}>{job_title}</h1>
        <h2 className={styles.companyName}>{company_name}</h2>
      </header>

      <main className={styles.mainContent}>
        <JobField icon={<LocationIcon />} text={location} />
        <JobField
          icon={<SackDollarIcon alt="salary" />}
          text={`${salary} LPA`}
        />
        <JobField
          icon={<UserTieIcon alt="experience" />}
          text={`${experience} years`}
        />
        <JobField icon={<ClockIcon alt="expiry date" />} text={expiry_date} />
        {skills_display?.length ? <Skills skills={skills_display} /> : null}
        {job_description && (
          <div className={styles.jobDescriptionContainer}>
            <h3 className={styles.jobDescriptionTitle}>Job Description</h3>
            <p className={styles.jobDescription}>{job_description}</p>
          </div>
        )}
      </main>
      {!view_only && renderApplyCta()}
      {!!applied_by.length && <AppliedByList applied_by={applied_by}/>}
    </div>
  );
};

export default JobDescriptionPage;
