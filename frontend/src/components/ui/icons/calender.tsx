import Image from "next/image";

import calenderIcon from "@/assets/icons/calender.svg";

const CalendarIcon = ({
  alt = "calender",
  height = 20,
  width = 20,
  className = "",
}) => (
  <span>
    <Image
      src={calenderIcon}
      alt={alt}
      height={height}
      width={width}
      className={className}
    />
  </span>
);

export default CalendarIcon;
