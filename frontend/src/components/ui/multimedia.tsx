import Image, { ImageProps } from "next/image";

const Multimedia = (props: ImageProps) => (
  <Image {...props} placeholder="blur" />
);

export default Multimedia;
