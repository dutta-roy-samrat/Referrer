import { FC } from "react";

import JobDescriptionPage from "@/components/post/description";

import { axiosServerInstance } from "@/services/axios";

const PostDescriptionPage: FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const id = (await params).id;
  const { data } = await axiosServerInstance.get(`/posts/${id}`);
  console.log(data, "kklop");
  return <JobDescriptionPage {...data} />;
};

export default PostDescriptionPage;
