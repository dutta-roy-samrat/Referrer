"use client"

import { cn } from "@/lib/utils";
import { FC, MouseEventHandler, ReactNode } from "react";

type AnimatedArrowBtnProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined
    text: string;
    renderIcon: () => ReactNode;
    iconClass?: string
}

const AnimatedArrowButton: FC<AnimatedArrowBtnProps> = ({ className = "", onClick, text = "", renderIcon, iconClass = "" }) => (
    <button
        className={cn("group bg-white text-center w-48 h-14 relative rounded-2xl text-black z-0 border text-base font-thin", className)}
    >
        <div className={cn("bg-black h-12 w-1/4 flex items-center justify-center absolute left-1 top-[3px] group-hover:w-[182px] z-10 duration-500 rounded-xl", iconClass)}>
            {renderIcon?.()}
        </div>
        <p className="translate-x-2">{text}</p>
    </button >
);

export default AnimatedArrowButton;