import Image from "next/image";

import userTieIcon from "@/assets/icons/user-tie.svg";

const UserTieIcon = ({ alt = "userTieIcon", height = 20, width = 20 }) => (
  <span>
    <Image src={userTieIcon} alt={alt} height={height} width={width} />
  </span>
);

export default UserTieIcon;
