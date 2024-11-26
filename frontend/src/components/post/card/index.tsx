import { FC, ReactNode } from "react";
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
import DeleteButton from "@/components/buttons/delete";
import { PostProps } from "@/components/post/card/types";

import JobField from "../shared/job-field";
import Skills from "../shared/skills";
import ArrowOnHover from "@/components/links/arrow-on-hover";

const PostCard: FC<PostProps> = ({
  showDeleteBtn = false,
  skills_display = [],
  experience_in_years,
  expiry_date,
  job_title,
  company_name,
  salary_in_lpa,
  location,
  id,
}) => {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between px-6 py-4">
        <div className="flex flex-col">
          <CardTitle className="text-lg font-semibold">{job_title}</CardTitle>
          <p className="text-gray-500">{company_name}</p>
        </div>
        {showDeleteBtn && <DeleteButton />}
      </CardHeader>

      <CardContent className="space-y-4 px-6 py-4">
        <JobField icon={<LocationIcon />} text={location} />
        <JobField
          icon={<SackDollarIcon alt="salary" />}
          text={`${salary_in_lpa} LPA`}
        />
        <JobField
          icon={<UserTieIcon alt="experience" />}
          text={`${experience_in_years} years`}
        />
        <JobField icon={<ClockIcon alt="expiry date" />} text={expiry_date} />
        {skills_display?.length ? <Skills skills={skills_display} /> : null}
      </CardContent>

      <CardFooter className="flex justify-center px-6 py-4 sm:justify-end">
        <ArrowOnHover
          text="Check Description"
          linkUrl={`/post/${id}`}
          linkClass="w-40"
        />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
