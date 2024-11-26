import Image from "next/image";

import clockIcon from "@/assets/icons/clock.svg";

const ClockIcon = ({ alt = "clock", height = 20, width = 20 }) => (
  <span>
    <Image src={clockIcon} alt={alt} height={height} width={width} />
  </span>
);

export default ClockIcon;
