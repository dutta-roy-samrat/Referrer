import JobDescriptionPage from "@/components/post/description";
import { axiosServerInstance } from "@/services/axios";

const PostDescriptionPage = async ({ params }) => {
  console.log(params);
  const { data } = await axiosServerInstance.get(`/posts/${params.id}`);
  console.log(data)
  return <JobDescriptionPage {...data}/>;
};

export default PostDescriptionPage;
