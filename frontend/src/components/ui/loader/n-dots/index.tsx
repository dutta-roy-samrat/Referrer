import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import styles from "./main.module.css";

const NDotsLoader = ({
  numOfDots = 3,
  animationClass = styles.defaultAnimationClass,
  dotClass = "",
  containerClass = "",
}) => {
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const dotTimeouts = dotsRef.current.map((ref, idx) =>
      setTimeout(() => {
        ref?.classList.add(animationClass);
      }, idx * 200),
    );

    return () => {
      dotTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);
  return (
    <div className={cn(styles.loaderContainer, containerClass)}>
      {Array.from({ length: numOfDots }).map((_, idx) => (
        <span
          key={idx}
          className={cn(styles.dotStyle, dotClass)}
          ref={(el) => {
            dotsRef.current[idx] = el;
          }}
        ></span>
      ))}
    </div>
  );
};

export default NDotsLoader;
