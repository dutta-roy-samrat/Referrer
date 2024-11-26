"use client";

import { axiosInstance } from "@/services/axios";
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
  };
};
type AuthContextProps = {
  resetAuthData: () => void;
  setAuthenticationData?: Dispatch<SetStateAction<AuthProps>>;
} & AuthProps;

const DEFAULT_AUTH_CONTEXT_VALUE = {
  isAuthenticated: null,
  isLoading: false,
  data: {
    full_name: "",
    email: "",
  },
  resetAuthData: () => {},
  setAuthenticationData: undefined,
};
const AuthContext = createContext<AuthContextProps>(DEFAULT_AUTH_CONTEXT_VALUE);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticationData, setAuthenticationData] = useState<AuthProps>(
    DEFAULT_AUTH_CONTEXT_VALUE
  );

  useEffect(() => {
    const fetchAuthData = async () => {
      setAuthenticationData({ ...DEFAULT_AUTH_CONTEXT_VALUE, isLoading: true });
      const response = await axiosInstance.get("/auth/check-auth");

      const { payload, is_authenticated } = response.data;

      setAuthenticationData({
        isLoading: false,
        data: payload,
        isAuthenticated: is_authenticated,
      });
    };
    fetchAuthData();
  }, []);

  const resetAuthData = useCallback(
    () => setAuthenticationData(DEFAULT_AUTH_CONTEXT_VALUE),
    []
  );

  const value = useMemo(
    () => ({ ...authenticationData, resetAuthData, setAuthenticationData }),
    [authenticationData, resetAuthData, setAuthenticationData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
