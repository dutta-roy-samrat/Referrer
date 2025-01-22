import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type CustomFileInputProps = {
  label?: ReactNode;
  file: File | null | undefined;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputId: string;
  className?: string;
  removeInput?: () => void;
  labelText?: string;
  fileUrl?: string;
};

const CustomFileInput: FC<CustomFileInputProps> = ({
  label,
  file = null,
  handleInputChange,
  inputProps = {},
  inputId,
  className = "",
  removeInput,
  labelText = "Choose a file",
  fileUrl = "",
}) => {
  const selectedFileName =
    file?.name && file?.name.length > 15
      ? `${file?.name.slice(0, 15)}...`
      : file?.name;
  const renderAttachedFileUrl = () => (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
      {selectedFileName}
    </a>
  );
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label || (
        <label
          htmlFor={inputId}
          className="block cursor-pointer rounded border p-2 text-sm font-medium text-black"
        >
          {labelText}
        </label>
      )}
      <input
        id={inputId}
        type="file"
        onChange={handleInputChange}
        className="hidden"
        {...inputProps}
      />
      {file?.name ? (
        <div className="flex items-center gap-2 rounded bg-gray-200 px-2 text-sm text-black">
          {fileUrl && renderAttachedFileUrl()}
          {removeInput && (
            <span onClick={removeInput} className="cursor-pointer text-red-500">
              &#x2715;
            </span>
          )}
        </div>
      ) : (
        fileUrl && <span className="text-gray-500">No file chosen</span>
      )}
    </div>
  );
};

export default CustomFileInput;
