import { FC } from "react";
import { AxiosError } from "axios";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SackDollarIcon from "@/components/ui/icons/sack-dollar";
import UserTieIcon from "@/components/ui/icons/user-tie";
import ClockIcon from "@/components/ui/icons/clock";
import LocationIcon from "@/components/ui/icons/location";
import DeleteButton from "@/components/ui/button/delete";
import JobField from "@/components/post/shared/job-field";
import Skills from "@/components/post/shared/skills";
import FooterBtn from "@/components/post/card/footer-btn";

import { PostProps } from "@/components/post/types";

import { axiosInstance } from "@/services/axios";
import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";

import styles from "./main.module.css";

const PostCard: FC<PostProps> = ({
  showDeleteBtn = false,
  skills_display = [],
  experience,
  expiry_date,
  job_title,
  company_name,
  salary,
  location,
  id,
}) => {
  const handleDeleteClick = async () => {
    try {
      const res = await axiosInstance.delete(`/posts/delete/${id}/`);
      onSuccessToastMsg(res.data?.message);
    } catch (err) {
      const error = err as AxiosError;
      onErrorToastMsg((error?.response?.data as { message: string })?.message);
    }
  };
  return (
    <Card>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <CardTitle className={styles.jobTitle}>{job_title}</CardTitle>
          <p className={styles.companyName}>{company_name}</p>
        </div>
        {showDeleteBtn && (
          <DeleteButton
            className={styles.deleteCta}
            onClick={handleDeleteClick}
          />
        )}
      </CardHeader>

      <CardContent className={styles.cardContent}>
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
      </CardContent>

      <CardFooter className={styles.cardFooter}>
        <FooterBtn id={id}/>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
