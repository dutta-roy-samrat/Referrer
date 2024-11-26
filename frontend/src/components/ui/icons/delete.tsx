import Image from "next/image";

import trashIcon from "@/assets/icons/trash.svg";

const DeleteIcon = ({ alt = "delete", height = 20, width = 20 }) => (
  <span>
    <Image src={trashIcon} alt={alt} height={height} width={width} />
  </span>
);

export default DeleteIcon;
