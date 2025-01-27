import { FC, ReactNode } from "react";
import { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

interface ErrorMessageProps {
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error, className }) => {
  if (!error) return null;
  return <p className={className}>{error as string}</p>;
};

export default ErrorMessage;
