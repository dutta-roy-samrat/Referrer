import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

import arrowIcon from "@/assets/icons/arrow.svg";

const ArrowOnHover = ({ text = "", linkClass = "", linkUrl = "" }) => (
  <Link
    href={linkUrl}
    className={cn(
      "group bg-black w-36 rounded-full flex justify-center items-center h-10 text-center flex-nowrap",
      linkClass
    )}
  >
    <div className="group-hover:hidden text-white flex justify-center items-center">
      {text}
    </div>

    <Image src={arrowIcon} alt="arrow" className="hidden group-hover:flex" />
  </Link>
);

export default ArrowOnHover;
