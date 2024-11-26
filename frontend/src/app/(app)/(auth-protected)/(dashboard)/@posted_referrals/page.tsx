"use client";

import AnimatedArrowButton from "@/components/buttons/animated-arrow";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import omit from "lodash/omit";

import arrowIcon from "@/assets/icons/arrow.svg";
import Image from "next/image";
import Feed from "@/components/feed";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/axios";
import NDotsLoader from "@/components/ui/loader/n-dots";

const fetchMorePosts = () => axiosInstance.get("/posts/my-posts?start_from=0");

const PostedReferrals = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchMorePosts,
  });
  console.log(data, "kklo");
  const renderArrowIcon = () => <Image src={arrowIcon} alt="add post" />;
  if (isLoading)
    return <NDotsLoader numOfDots={5} animationClass="animate-bounce" />;
  return (
    <article className="px-4 pb-5 pt-14 sm:px-8">
      <header className="mb-4 flex items-center justify-between">
        <div className="text-xl font-bold">Your Posts</div>
        <Link href="/my-posts">
          <AnimatedArrowButton text="View All" renderIcon={renderArrowIcon} />
        </Link>
      </header>
      <ScrollArea className="whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          <Feed postList={data.data} showSkills={false} showDeleteBtn />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </article>
  );
};

export default PostedReferrals;
