"use client";

import { axiosInstance } from "@/services/axios";
import { AxiosError } from "axios";
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
} & AuthProps;

const DEFAULT_AUTH_CONTEXT_VALUE = {
  isAuthenticated: null,
  isLoading: true,
  data: {
    full_name: "",
    email: "",
    id: ""
  },
  resetAuthData: () => { },
  setAuthenticationData: undefined,
};
const AuthContext = createContext<AuthContextProps>(DEFAULT_AUTH_CONTEXT_VALUE);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticationData, setAuthenticationData] = useState<AuthProps>(
    DEFAULT_AUTH_CONTEXT_VALUE
  );
  const pathname = usePathname();
  const { push } = useRouter()
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await axiosInstance.get("/auth/get-user-details");
        const { payload, is_authenticated } = response.data;

        setAuthenticationData({
          isLoading: false,
          data: payload,
          isAuthenticated: is_authenticated,
        });
      }
      catch (e) {
        const err = e as AxiosError
        if (err?.status === 401 && !["/login", "/sign-up", "/reset-password", "/reset-password/set-password"].includes(pathname)) {
          push(`/login?redirect=${pathname}`)
        }
        setAuthenticationData({ ...DEFAULT_AUTH_CONTEXT_VALUE, isLoading: false })
        console.error(err)
      }
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
