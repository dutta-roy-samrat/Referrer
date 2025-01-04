import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, ReactNode } from "react";

type CustomFileInputProps = {
  label?: ReactNode;
  file: File | null | undefined;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: any;
  inputId: string;
  className?: string;
  removeInput?: () => void;
  labelText?: string;
  fileUrl: string;
};

const defaultObj: { [key: string]: any } = {};
const CustomFileInput: FC<CustomFileInputProps> = ({
  label,
  file = defaultObj,
  handleInputChange,
  inputProps,
  inputId,
  className = "",
  removeInput,
  labelText,
  fileUrl = "",
}) => {
  const selectedFileName =
    file?.name?.length > 15 ? `${file?.name.slice(0, 16)}...` : file?.name;
  return (
    <div className={cn("flex items-center", className)}>
      {label || (
        <label
          htmlFor={inputId}
          className="block cursor-pointer border p-1 text-sm font-medium text-black"
        >
          {labelText || "Choose a file"}
        </label>
      )}
      <input
        id={inputId}
        type="file"
        onChange={handleInputChange}
        className="hidden"
        {...inputProps}
        {...[file]}
      />
      {file?.name ? (
        <div className="break-all rounded-md bg-gray-200 px-2 text-sm text-black">
          <a href={fileUrl} target="_blank">
            {selectedFileName}
          </a>
          {removeInput && (
            <span onClick={removeInput} className="cursor-pointer">
              &#x2715;
            </span>
          )}
        </div>
      ) : (
        <div>No file chosen</div>
      )}
    </div>
  );
};

export default CustomFileInput;
