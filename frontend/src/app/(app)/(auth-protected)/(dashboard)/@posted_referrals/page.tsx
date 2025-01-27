"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import AnimatedArrowButton from "@/components/ui/button/animated-arrow";
import DashboardScrollableSection from "@/components/dashboard-scrollable-sections";
import StyledLink from "@/components/ui/link/styled-link";

import { axiosInstance } from "@/services/axios";

import arrowIcon from "@/assets/icons/arrow.svg";

import styles from "./main.module.css";

const fetchMorePosts = () => axiosInstance.get("/posts/my-posts?start_from=0");

const PostedReferrals = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchMorePosts,
    refetchOnWindowFocus: false,
  });

  const renderFallbackContent = () => (
    <>
      You haven't created any posts yet. Create one to make a positive impact
      and help countless people!
    </>
  );

  const renderArrowIcon = () => <Image src={arrowIcon} alt="add post" />;

  const postList = useMemo(() => data?.data, [data?.data]);

  const renderHeaderContent = () => (
    <>
      <div className={styles.articleHeaderText}>My Posts</div>
      {!!postList?.length && (
        <StyledLink href="/my-posts">
          <AnimatedArrowButton text="View All" renderIcon={renderArrowIcon} />
        </StyledLink>
      )}
    </>
  );

  return (
    <DashboardScrollableSection
      renderFallbackContent={renderFallbackContent}
      renderHeaderContent={renderHeaderContent}
      isLoading={isLoading}
      data={postList}
      showDeleteBtn
    />
  );
};

export default PostedReferrals;
