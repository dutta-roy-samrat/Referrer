import { axiosInstance } from "@/services/axios";

export const fetchFile = async ({ data, fileName }) => {
  try {
    const res = await axiosInstance.get(`media/${data}`, {
      responseType: "blob",
    });

    if (!res || res.status !== 200) {
      throw new Error("File not found or error occurred");
    }

    const blob = res.data;
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error fetching the file:", error);
  }
};
