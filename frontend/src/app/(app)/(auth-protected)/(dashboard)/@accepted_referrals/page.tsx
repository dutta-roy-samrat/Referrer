"use client"

import AnimatedArrowButton from "@/components/buttons/animated-arrow";
import Post from "@/components/post/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import arrowIcon from "@/assets/icons/arrow.svg"
import Image from "next/image";

const AcceptedReferrals = () => {
  const dummyData = [
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
    {
      experience: 3,
      companyName: "Vinsol",
      jobTitle: "Frontend Engineer",
      salary: 12,
      expiry: "12/10/2021",
      location: "Delhi",
    },
  ];
  const renderArrowIcon = () => <Image src={arrowIcon} alt="add post" />
  return (
    <article className="pt-5 pb-16 px-4 sm:px-8">
      <header className="flex justify-between mb-4 items-center">
        <div className="font-bold text-xl">Successfully Referred To</div>
        <Link href="/my-posts"><AnimatedArrowButton text="View All" renderIcon={renderArrowIcon} /></Link>
      </header>
      <ScrollArea className="whitespace-nowrap rounded-md border">
        <section className="flex w-max space-x-4 p-4">
          {dummyData.map((data, idx) => (
            <Post key={idx} {...data} />
          ))}
        </section>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </article>
  );
};

export default AcceptedReferrals;
