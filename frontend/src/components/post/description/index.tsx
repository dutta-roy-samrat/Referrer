import { FC } from "react";
import SackDollarIcon from "@/components/ui/icons/sack-dollar";
import UserTieIcon from "@/components/ui/icons/user-tie";
import ClockIcon from "@/components/ui/icons/clock";
import LocationIcon from "@/components/ui/icons/location";
import { PostProps } from "@/components/post/card/types";

import JobField from "../shared/job-field";
import Skills from "../shared/skills";
import ArrowOnHover from "@/components/links/arrow-on-hover";

const JobDescriptionPage: FC<PostProps> = ({
  skills_display = [],
  experience_in_years,
  expiry_date,
  job_title,
  company_name,
  salary_in_lpa,
  location,
  id,
  job_description,
}) => {
  return (
    <div className="container mx-auto p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{job_title}</h1>
        <h2 className="text-lg text-gray-600">{company_name}</h2>
      </header>

      <main className="space-y-6">
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
        {job_description && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {job_description}
            </p>
          </div>
        )}
      </main>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 flex justify-center">
        <ArrowOnHover text="Apply Here" />
      </div>
    </div>
  );
};

export default JobDescriptionPage;
