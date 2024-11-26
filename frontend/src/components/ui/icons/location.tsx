import Image from "next/image";

import locationIcon from "@/assets/icons/location.svg";

const LocationIcon = ({ alt = "location", height = 20, width = 20 }) => (
  <span>
    <Image src={locationIcon} alt={alt} height={height} width={width} />
  </span>
);

export default LocationIcon;
