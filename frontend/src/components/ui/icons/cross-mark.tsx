import Image from "next/image";

import crossIcon from "@/assets/icons/cross-mark.svg";

const CrossIcon = ({ alt = "cross mark", height = 20, width = 20 }) => (
  <span>
    <Image src={crossIcon} alt={alt} height={height} width={width} />
  </span>
);

export default CrossIcon;
