import { FC, ReactNode } from "react";

import StyledLink from "@/components/ui/link/styled-link";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";

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
    <StyledLink href={fileUrl} target="_blank">
      {selectedFileName}
    </StyledLink>
  );
  return (
    <div className={cn(styles.customFileInputContainer, className)}>
      {label || (
        <label htmlFor={inputId} className={styles.customFileInputLabel}>
          {labelText}
        </label>
      )}
      <input
        id={inputId}
        type="file"
        onChange={handleInputChange}
        className={styles.hiddenFileInput}
        {...inputProps}
      />
      {file?.name ? (
        <div className={styles.selectionText}>
          {fileUrl && renderAttachedFileUrl()}
          {removeInput && (
            <span onClick={removeInput} className={styles.removeFileIcon}>
              &#x2715;
            </span>
          )}
        </div>
      ) : (
        fileUrl && <span className={styles.noFileChosen}>No file chosen</span>
      )}
    </div>
  );
};

export default CustomFileInput;
