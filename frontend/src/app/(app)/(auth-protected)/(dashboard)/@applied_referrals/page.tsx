"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import AnimatedArrowButton from "@/components/ui/button/animated-arrow";
import StyledLink from "@/components/ui/link/styled-link";
import DashboardScrollableSection from "@/components/dashboard-scrollable-sections";

import { axiosInstance } from "@/services/axios";

import arrowIcon from "@/assets/icons/arrow.svg";

import styles from "./main.module.css";

const fetchMorePosts = () =>
  axiosInstance.get("/posts/applied-to/?start_from=0");

const AppliedReferrals = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["applied-posts"],
    queryFn: fetchMorePosts,
    refetchOnWindowFocus: false,
  });

  const renderFallbackContent = () => (
    <>
      <div>
        You haven't applied to any posts yet. Start exploring opportunities now,
        and take the first step toward landing your dream job! &nbsp;
        <StyledLink href="/feed" type="underlined" className="">
          Browse Posts Now
        </StyledLink>
        .
      </div>
    </>
  );

  const renderArrowIcon = () => <Image src={arrowIcon} alt="add post" />;

  const postList = useMemo(() => data?.data, [data?.data]);

  const renderHeaderContent = () => (
    <>
      <div className={styles.articleHeaderText}>Applied Posts</div>
      {!!postList?.length && (
        <StyledLink href="/applied-posts">
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
    />
  );
};

export default AppliedReferrals;
