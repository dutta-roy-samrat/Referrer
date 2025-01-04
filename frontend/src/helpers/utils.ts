export const getFileUrl = (file: File | null) =>
  file ? URL.createObjectURL(file) : "";
