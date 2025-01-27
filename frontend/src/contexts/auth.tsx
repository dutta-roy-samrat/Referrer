"use client";

import {
  ApolloQueryResult,
  OperationVariables,
  useLazyQuery,
} from "@apollo/client";
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

import { fetchBasicUserInfo } from "@/graphql/query/basic-user-details";

import { MEDIA_LIBRARY_URL } from "@/constants/environment-variables";

export type AuthDataType = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  resume: File | null;
  experience: number;
  profileImage: string;
};

type AuthProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
  data: AuthDataType;
};

type AuthContextProps = {
  resetAuthData: () => void;
  setAuthenticationData: Dispatch<SetStateAction<AuthProps>>;
  refetchUserDetails: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<any>> | void;
} & AuthProps;

const DEFAULT_AUTH_VALUE = {
  isLoading: true,
  isAuthenticated: false,
  data: {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    resume: null,
    experience: 0,
    profileImage: "",
  },
};
const DEFAULT_AUTH_CONTEXT_VALUE = {
  resetAuthData: () => {},
  setAuthenticationData: () => {},
  refetchUserDetails: () => {},
  ...DEFAULT_AUTH_VALUE,
};

const AuthContext = createContext<AuthContextProps>(DEFAULT_AUTH_CONTEXT_VALUE);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticationData, setAuthenticationData] =
    useState<AuthProps>(DEFAULT_AUTH_VALUE);
  const [fetchAuthData] = useLazyQuery(fetchBasicUserInfo, {
    ssr: true,
    onError: (error) => {
      setAuthenticationData({
        ...DEFAULT_AUTH_VALUE,
        isLoading: false,
      });
      error?.graphQLErrors.forEach((graphQLError) =>
        console.error("GraphQL error:", graphQLError.message),
      );
    },
    onCompleted: (data) => {
      if (data?.getUserDetails) {
        setAuthenticationData({
          isAuthenticated: true,
          data: {
            ...DEFAULT_AUTH_VALUE.data,
            ...data.getUserDetails,
            profileImage: data.getUserDetails.profileImage
              ? `${MEDIA_LIBRARY_URL}${data.getUserDetails.profileImage}`
              : "",
          },
          isLoading: false,
        });
      }
    },
    fetchPolicy: "cache-and-network",
  });

  const resetAuthData = useCallback(() => {
    setAuthenticationData({ ...DEFAULT_AUTH_VALUE, isLoading: false });
  }, []);

  useEffect(() => {
    fetchAuthData();
  }, []);

  const value = useMemo(
    () => ({
      ...authenticationData,
      resetAuthData,
      setAuthenticationData,
      refetchUserDetails: fetchAuthData,
    }),
    [authenticationData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
