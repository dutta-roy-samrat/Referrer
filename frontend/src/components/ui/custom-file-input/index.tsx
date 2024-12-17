import { FC, ReactNode } from "react";

type CustomFileInputProps = {
  label: ReactNode | undefined;
  file: File | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: any;
};

const CustomFileInput: FC<CustomFileInputProps> = ({
  label,
  file,
  handleImageUpload,
  inputProps,
}) => (
  <div className="flex items-center">
    {label || (
      <label
        htmlFor="file"
        className="block cursor-pointer border p-1 text-sm font-medium text-black"
      >
        Choose a file
      </label>
    )}
    <input
      id="file"
      type="file"
      onChange={handleImageUpload}
      className="hidden"
      {...inputProps}
    />
    <div className="text-sm text-black">
      {file ? `Selected File: ${file.name}` : "No file chosen"}
    </div>
  </div>
);

export default CustomFileInput;
