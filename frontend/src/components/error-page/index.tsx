import { FC } from "react";

import StyledButton from "@/components/ui/button/styled-button";

const ErrorPage: FC<ErrorBoundaryType> = ({ error, reset }) => {
  console.error(error);
  return (
    <div>
      <h2>Something went wrong!</h2>
      <StyledButton onClick={() => reset()}>Try again</StyledButton>
    </div>
  );
};

export default ErrorPage;
