import JobDescriptionPage from "@/components/post/description";
import { axiosServerInstance } from "@/services/axios";

const PostDescriptionPage = async ({ params }) => {
  const { data } = await axiosServerInstance.get(`/posts/${params.id}`);
  return <JobDescriptionPage {...data}/>;
};

export default PostDescriptionPage;
