"use client";

import { axiosInstance } from "@/services/axios";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthProps = {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  data: {
    full_name: string;
    email: string;
    id: string;
  };
};

type AuthContextProps = {
  resetAuthData: () => void;
  setAuthenticationData?: Dispatch<SetStateAction<AuthProps>>;
  refetchUserDetails: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any>, Error>> | void;
} & AuthProps;

const DEFAULT_AUTH_CONTEXT_VALUE = {
  isAuthenticated: null,
  isLoading: true,
  data: {
    full_name: "",
    email: "",
    id: "",
  },
  resetAuthData: () => {},
  setAuthenticationData: undefined,
  refetchUserDetails: () => {},
};

const AuthContext = createContext<AuthContextProps>(DEFAULT_AUTH_CONTEXT_VALUE);

export const useAuthContext = () => useContext(AuthContext);

const fetchAuth = () => axiosInstance.get("/auth/get-user-details");

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const { data, refetch, isLoading, error, isSuccess, isError } = useQuery({
    queryKey: ["check-auth"],
    queryFn: fetchAuth,
    refetchOnWindowFocus: false,
  });

  const [authenticationData, setAuthenticationData] = useState<AuthProps>(
    DEFAULT_AUTH_CONTEXT_VALUE,
  );

  useEffect(() => {
    if (isSuccess) {
      const { payload, is_authenticated } = data?.data;
      setAuthenticationData({
        isAuthenticated: is_authenticated,
        data: payload,
        isLoading,
      });
    }

    if (isError) {
      const err = error as AxiosError;
      if (
        err?.status === 401 &&
        ![
          "/login",
          "/sign-up",
          "/reset-password",
          "/reset-password/set-password",
        ].includes(pathname)
      ) {
        push(`/login?redirect=${pathname}`);
      }

      setAuthenticationData({
        ...DEFAULT_AUTH_CONTEXT_VALUE,
        isLoading: false,
      });
      console.error(err);
    }
  }, [isLoading]);

  const resetAuthData = useCallback(
    () => setAuthenticationData(DEFAULT_AUTH_CONTEXT_VALUE),
    [],
  );

  const value = useMemo(
    () => ({
      ...authenticationData,
      resetAuthData,
      setAuthenticationData,
      refetchUserDetails: refetch,
    }),
    [authenticationData, resetAuthData, setAuthenticationData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
