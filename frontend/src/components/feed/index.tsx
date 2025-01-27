"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import omit from "lodash/omit";

import { PostProps } from "@/components/post/types";
import SpinnerLoader from "@/components/ui/loader/spinner";

import { axiosInstance } from "@/services/axios";

import { POST_QUERY_LIMIT } from "@/constants/posts";

import styles from "./main.module.css";

const PostCard = dynamic(() => import("@/components/post/card"));

type FeedProps = {
  postList: PostProps[];
  showSkills?: boolean;
  showDeleteBtn?: boolean;
};

const Feed: FC<FeedProps> = ({
  postList,
  showSkills = true,
  showDeleteBtn,
}) => {
  const [posts, setPosts] = useState<PostProps[]>(postList);
  const [showLoader, setShowLoader] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const eventSource = new EventSource(`${API_URL}/posts/events/`, {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      console.log("Connection opened");
    };

    const handleMessage = (e: MessageEvent) => {
      console.log(JSON.parse(e.data));
      try {
        const eventData = JSON.parse(e.data);
        if (eventData?.action === "delete") {
          const remainingPosts = posts.filter(({ id }) => id !== eventData.id);
          return setPosts(remainingPosts);
        }
        return setPosts((prevPosts) => [eventData, ...prevPosts]);
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    };

    eventSource.addEventListener("message", handleMessage);

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.close();
    };
  }, []);

  const fetchMorePosts = useCallback(
    async (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ) => {
      if (!entries[0].isIntersecting) return;

      setShowLoader(true);
      try {
        const { data: newPosts } = await axiosInstance.get<PostProps[]>(
          `/posts?start_from=${posts.length}`,
        );

        if (newPosts.length < POST_QUERY_LIMIT) {
          observer.disconnect();
        }

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setShowLoader(false);
      }
    },
    [posts.length],
  );

  useEffect(() => {
    const currentTarget = targetRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(fetchMorePosts, {
      rootMargin: "0px",
      threshold: 1.0,
    });

    observer.observe(currentTarget);

    return () => {
      observer.unobserve(currentTarget);
      observer.disconnect();
    };
  }, [fetchMorePosts]);

  return (
    <>
      {posts.map((post, idx) => (
        <div
          key={post.id ?? idx}
          ref={idx === posts.length - 3 ? targetRef : undefined}
        >
          <PostCard
            {...(showSkills
              ? { ...post, showDeleteBtn }
              : { ...omit(post, "skills_display"), showDeleteBtn })}
          />
        </div>
      ))}
      {showLoader && (
        <div className={styles.loader}>
          <SpinnerLoader />
        </div>
      )}
    </>
  );
};

export default Feed;
