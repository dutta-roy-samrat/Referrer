type ErrorBoundaryType = {
  error: Error & { digest?: string };
  reset: () => void;
};
