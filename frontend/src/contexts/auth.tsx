"use client";

import {
  ApolloQueryResult,
  OperationVariables,
  useQuery,
} from "@apollo/client";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { fetchBasicUserInfo } from "@/graphql/query/basic-user-details";

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

  const { refetch } = useQuery(fetchBasicUserInfo, {
    skip: authenticationData.isAuthenticated,
    ssr: true,
    onError: (error) => {
      setAuthenticationData({
        ...DEFAULT_AUTH_VALUE,
        isLoading: false,
      });
      if (error?.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError) =>
          console.error("GraphQL error:", graphQLError.message),
        );
      }
    },
    onCompleted: (data) => {
      setAuthenticationData({
        isAuthenticated: true,
        data: {
          ...DEFAULT_AUTH_VALUE.data,
          ...data.getUserDetails,
          profileImage: data.getUserDetails.profileImage
            ? `http://localhost:8000/media/${data.getUserDetails.profileImage}`
            : "",
        },
        isLoading: false,
      });
    },
  });

  const resetAuthData = useCallback(
    () => setAuthenticationData(DEFAULT_AUTH_VALUE),
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
