"use client";

import AnimatedArrowButton from "@/components/ui/buttons/animated-arrow";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import omit from "lodash/omit";

import arrowIcon from "@/assets/icons/arrow.svg";
import Image from "next/image";
import Feed from "@/components/feed";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/axios";
import NDotsLoader from "@/components/ui/loader/n-dots";

const fetchMorePosts = () => axiosInstance.get("/posts/applied-to?start_from=0");

const AppliedReferrals = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["applied-posts"],
    queryFn: fetchMorePosts,
    refetchOnWindowFocus: false,
  });
  const renderContent = () =>
    postList?.length ? (
      renderScrollSection()
    ) : (
      <div className="flex h-64 items-center justify-center whitespace-nowrap rounded-md border">
        You haven't applied to any posts yet. Start exploring opportunities now,
        and take the first step toward landing your dream job!
        <Link href="/feed">Browse posts</Link>.
      </div>
    );
  const renderLoader = () => (
    <div className="flex h-64 items-center justify-center whitespace-nowrap rounded-md border">
      <NDotsLoader numOfDots={5} animationClass="animate-bounce" />
    </div>
  );

  const renderArrowIcon = () => <Image src={arrowIcon} alt="add post" />;

  const postList = data?.data;

  const renderScrollSection = () => (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        <Feed postList={postList} showSkills={false} showDeleteBtn />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  return (
    <article className="px-4 pb-5 pt-14 sm:px-8">
      <header className="mb-4 flex items-center justify-between">
        <div className="text-xl font-bold">Applied Posts</div>
        {!!postList?.length && (
          <Link href="/applied-posts">
            <AnimatedArrowButton text="View All" renderIcon={renderArrowIcon} />
          </Link>
        )}
      </header>
      {isLoading ? renderLoader() : renderContent()}
    </article>
  );
};

export default AppliedReferrals;
