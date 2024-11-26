"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { PostProps } from "@/components/post/card/types";
import { axiosInstance } from "@/services/axios";

import { POST_QUERY_LIMIT } from "@/constants/posts";
import SpinnerLoader from "../ui/loader/spinner";
import { omit } from "lodash";

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
    const eventSource = new EventSource("http://localhost:8000/posts/events/", {
      withCredentials: true,
    });

    eventSource.onopen = () => console.log("Connection opened");

    eventSource.addEventListener("message", (e) => {
      try {
        const newPost = JSON.parse(e.data);
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {});

  const fetchMorePosts = useCallback(
    (_: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      setShowLoader(true);
      return axiosInstance
        .get(`/posts?start_from=${posts.length}`)
        .then(({ data: newPosts }) => {
          if (newPosts.length < POST_QUERY_LIMIT) {
            observer.disconnect();
          }
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        })
        .catch((error) => console.error("Error fetching posts:", error))
        .finally(() => setShowLoader(false));
    },
    [posts.length],
  );

  useEffect(() => {
    if (targetRef.current) {
      const observer = new IntersectionObserver(fetchMorePosts, {
        rootMargin: "0px",
        threshold: 1.0,
      });
      observer.observe(targetRef.current);

      return () => {
        if (targetRef.current) {
          observer.unobserve(targetRef.current);
          observer.disconnect();
        }
      };
    }
  }, [targetRef.current]);

  return (
    <>
      {posts.map((post, idx) => {
        const postProps = idx === posts.length - 3 ? { ref: targetRef } : {};
        const postDetails = { ...post, showDeleteBtn };
        return (
          <div key={idx} {...postProps}>
            <PostCard {...(showSkills ? postDetails : omit(postDetails, "skills_display"))} />
          </div>
        );
      })}
      {showLoader && (
        <div className="flex h-52 items-center justify-center">
          <SpinnerLoader />
        </div>
      )}
    </>
  );
};

export default Feed;
