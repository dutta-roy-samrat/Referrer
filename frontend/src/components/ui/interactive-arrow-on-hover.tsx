"use client"

import { ReactNode, ElementType } from "react";
import Image from "next/image";

import StyledLink from "@/components/ui/link/styled-link";
import NDotsLoader from "@/components/ui/loader/n-dots";

import { cn } from "@/lib/utils";

import arrowIcon from "@/assets/icons/arrow.svg";

type ArrowOnHoverProps<T extends ElementType = typeof StyledLink> = {
  text: ReactNode;
  className?: string;
  Component?: T;
  href?: string;
  onClick?: () => void;
  loading?: boolean;
};

const ArrowOnHover = <T extends ElementType = typeof StyledLink>({
  text = "",
  className = "",
  Component,
  href = "#",
  loading,
  ...restProps
}: ArrowOnHoverProps<T>) => {
  const ComponentToRender = Component || StyledLink;
  
  const renderContent = () => (
    <>
      <div className="flex items-center justify-center text-white group-hover:hidden">
        {text}
      </div>
      <Image src={arrowIcon} alt="arrow" className="hidden group-hover:flex" />
    </>
  );

  return (
    <ComponentToRender
      href={href}
      className={cn(
        "group flex h-10 w-36 flex-nowrap items-center justify-center rounded-full bg-black text-center",
        className,
      )}
      {...restProps}
    >
      {loading ? (
        <NDotsLoader numOfDots={5} dotClass="!bg-white" />
      ) : (
        renderContent()
      )}
    </ComponentToRender>
  );
};

export default ArrowOnHover;
