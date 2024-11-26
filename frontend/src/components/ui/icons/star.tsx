import Image from "next/image";

import starIcon from "@/assets/icons/star.svg";

const StarIcon = ({ alt = "star", height = 20, width = 20 }) => (
  <span>
    <Image src={starIcon} alt={alt} height={height} width={width} />
  </span>
);

export default StarIcon;
