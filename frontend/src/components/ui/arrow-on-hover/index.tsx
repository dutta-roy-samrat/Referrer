import { FC, JSXElementConstructor, ReactNode } from "react";

import { cn } from "@/lib/utils";

import Image from "next/image";

import arrowIcon from "@/assets/icons/arrow.svg";

type ArrowOnHoverProps = {
  text: ReactNode;
  className?: string;
  Component: JSXElementConstructor<any>;
  href?: string;
  onClick?: () => void;
};

const ArrowOnHover: FC<ArrowOnHoverProps> = ({
  text = "",
  className = "",
  Component,
  ...restProps
}) => {
  const renderContent = () => (
    <>
      <div className="flex items-center justify-center text-white group-hover:hidden">
        {text}
      </div>

      <Image src={arrowIcon} alt="arrow" className="hidden group-hover:flex" />
    </>
  );
  if (Component) {
    return (
      <Component
        className={cn(
          "group flex h-10 w-36 flex-nowrap items-center justify-center rounded-full bg-black text-center",
          className,
        )}
        {...restProps}
      >
        {renderContent()}
      </Component>
    );
  }
};

export default ArrowOnHover;
