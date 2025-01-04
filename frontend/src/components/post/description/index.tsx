import { FC } from "react";
import SackDollarIcon from "@/components/ui/icons/sack-dollar";
import UserTieIcon from "@/components/ui/icons/user-tie";
import ClockIcon from "@/components/ui/icons/clock";
import LocationIcon from "@/components/ui/icons/location";
import { PostProps } from "@/components/post/card/types";

import JobField from "../shared/job-field";
import Skills from "../shared/skills";
import ArrowOnHover from "@/components/ui/arrow-on-hover";
import { axiosInstance } from "@/services/axios";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import ReferralApplicationForm from "@/components/form/referral-application";

const JobDescriptionPage: FC<PostProps> = ({
  skills_display = [],
  experience,
  expiry_date,
  job_title,
  company_name,
  salary,
  location,
  id,
  job_description,
}) => {
  // const handleApplyClick = () => {
  //   axiosInstance.patch("/posts/apply");
  // };
  return (
    <div className="container mx-auto p-6 pb-24">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{job_title}</h1>
        <h2 className="text-lg text-gray-600">{company_name}</h2>
      </header>

      <main className="space-y-6">
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
          <div className="mt-6">
            <h3 className="mb-2 text-xl font-semibold">Job Description</h3>
            <p className="whitespace-pre-line text-gray-700">
              {job_description}
            </p>
          </div>
        )}
      </main>
      <div className="fixed bottom-0 left-0 flex w-full justify-center border-t border-gray-300 bg-white p-4">
        <Dialog>
          <ArrowOnHover text="Apply Here" Component={DialogTrigger} />
          <DialogContent>
            <DialogTitle>Application Form</DialogTitle>
            <ReferralApplicationForm id={id} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobDescriptionPage;
