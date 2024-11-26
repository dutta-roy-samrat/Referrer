"use client";

import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

interface CurrentDeviceContextValue {
  isDesktop: boolean;
  isResponsive: boolean;
}

const CurrentDeviceContext = createContext<CurrentDeviceContextValue>({
  isDesktop: false,
  isResponsive: false,
});

export const useCurrentDeviceContext = () =>
  useContext<CurrentDeviceContextValue>(CurrentDeviceContext);

const CurrentDeviceContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contextValue, setContextValue] = useState<CurrentDeviceContextValue>({
    isDesktop: false,
    isResponsive: false,
  });

  useEffect(() => {
    const updateDeviceContext = () => {
      if (window.innerWidth >= 1024) {
        return setContextValue({
          isResponsive: false,
          isDesktop: true,
        });
      }
      return setContextValue({ isDesktop: false, isResponsive: true });
    };
    updateDeviceContext();
    addEventListener("resize", updateDeviceContext);
    return () => removeEventListener("resize", updateDeviceContext);
  }, []);

  return (
    <CurrentDeviceContext.Provider value={contextValue}>
      {children}
    </CurrentDeviceContext.Provider>
  );
};

export default CurrentDeviceContextProvider;
