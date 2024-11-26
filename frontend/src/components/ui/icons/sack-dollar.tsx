import Image from "next/image";

import sackDollarIcon from "@/assets/icons/sack-dollar.svg";

const SackDollarIcon = ({ alt = "sack-dollar", height = 20, width = 20 }) => (
  <span>
    <Image src={sackDollarIcon} alt={alt} height={height} width={width} />
  </span>
);

export default SackDollarIcon;
