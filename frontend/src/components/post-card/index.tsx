import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SackDollarIcon from "../ui/icons/sack-dollar";
import UserTieIcon from "../ui/icons/user-tie";
import ClockIcon from "../ui/icons/clock";

import styles from "./main.module.css";
import StarIcon from "../ui/icons/star";
import DeleteIcon from "../ui/icons/delete";
import LocationIcon from "../ui/icons/location";
import { FC } from "react";

type PostProps = {
  showDeleteBtn?: boolean;
  skills?: string[];
  experience: number;
  expiry: string;
  jobTitle: string;
  companyName: string;
  salary: number;
  location: string;
};

const Post: FC<PostProps> = ({
  showDeleteBtn = false,
  skills = [],
  experience,
  expiry,
  jobTitle,
  companyName,
  salary,
  location,
}) => {
  const renderSkills = () =>
    (skills || []).map((skill) => (
      <span key={skill} className="bg-black text-white px-4 py-1 rounded-full">
        {skill}
      </span>
    ));
  return (
    <section>
      <Card>
        <CardHeader className="pl-10 pb-3 flex-row justify-between items-start">
          <div className="flex flex-col items-start gap-3">
            <CardTitle className="text-lg">{jobTitle}</CardTitle>
            <div>{companyName}</div>
          </div>
          {showDeleteBtn && <DeleteIcon width={15} height={15} />}
        </CardHeader>
        <CardContent className="flex flex-col gap-5 p-10 pt-3">
          <div className={styles.contentFieldContainer}>
            <LocationIcon />
            <span>{location}</span>
          </div>
          <div className={styles.contentFieldContainer}>
            <SackDollarIcon alt="salary" />
            <span>{salary} LPA</span>
          </div>
          <div className={styles.contentFieldContainer}>
            <UserTieIcon alt="experience" />
            <span>{experience} years</span>
          </div>
          <div className={styles.contentFieldContainer}>
            <ClockIcon alt="exipry date" />
            <span>{expiry}</span>
          </div>
          {skills?.length ? (
            <div className={styles.contentFieldContainer}>
              <StarIcon alt="skills" />
              {renderSkills()}
            </div>
          ) : (
            ""
          )}
        </CardContent>
        <CardFooter className="justify-center sm:justify-end">
          <button className="bg-black text-white w-60 h-10 rounded-full">
            View
          </button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Post;
