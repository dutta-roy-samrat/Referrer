import React, {  MouseEventHandler, ReactNode } from "react";

import StyledButton from "@/components/ui/button/styled-button";

import { cn } from "@/lib/utils";

type AnimatedArrowBtnProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  text: string;
  renderIcon: () => ReactNode;
  iconClass?: string;
};

const AnimatedArrowButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedArrowBtnProps
>(({ className = "", onClick, text = "", renderIcon, iconClass = "" }, ref) => (
  <StyledButton
    ref={ref}
    onClick={onClick}
    className={cn(
      "group relative z-0 h-14 w-48 rounded-2xl border bg-white text-center text-base font-thin text-black",
      className,
    )}
    variant="noStyle"
  >
    <div
      className={cn(
        "absolute left-1 top-[3px] z-10 flex h-12 w-1/4 items-center justify-center rounded-xl bg-black duration-500 group-hover:w-[182px]",
        iconClass,
      )}
    >
      {renderIcon?.()}
    </div>
    <p className="translate-x-2">{text}</p>
  </StyledButton>
));

export default AnimatedArrowButton;
