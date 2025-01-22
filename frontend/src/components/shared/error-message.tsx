import { FC } from 'react';
import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

interface ErrorMessageProps {
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error, className }) => {
  if (!error) return null;
  
  const message = typeof error === 'string' ? error : error.message;
  return <p className={className}>{message}</p>;
};

export default ErrorMessage; 