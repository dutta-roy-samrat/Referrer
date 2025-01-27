import { FC, useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import StyledButton from "@/components/ui/button/styled-button";

import styles from "./main.module.css";

type ImageCropperModalContentProps = {
  imageSrc: string;
  setProfileImage: (imgSrc: string) => void;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  selectedFile: File | null;
  setConfirmedFile: React.Dispatch<React.SetStateAction<File | null>>;
  crop: {
    x: number;
    y: number;
  };
  setCrop: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const ImageCropperModalContent: FC<ImageCropperModalContentProps> = ({
  imageSrc,
  setProfileImage,
  setSelectedFile,
  selectedFile,
  setConfirmedFile,
  crop,
  setCrop,
  zoom,
  setZoom,
}) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): HTMLImageElement => {
    const img = document.createElement("img");
    img.src = url;
    return img;
  };

  const getCroppedImage = async (): Promise<Blob> => {
    const image = createImage(imageSrc as string);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height, x, y } = croppedAreaPixels!;
    canvas.width = width;
    canvas.height = height;

    ctx?.drawImage(image, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, "image/jpeg");
    });
  };

  const handleSaveImage = async () => {
    const croppedBlob = await getCroppedImage();
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setProfileImage(croppedUrl);
    const croppedFile = new File(
      [croppedBlob],
      selectedFile?.name || "cropped-image.jpg",
      { type: "image/jpeg" },
    );
    setConfirmedFile(croppedFile);
    setSelectedFile(null);
  };

  return (
    <DialogContent
      onClose={() => {
        setSelectedFile(null);
      }}
    >
      <div className={styles.dialogContentContainer}>
        <div className={styles.cropperContainer}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="round"
          />
        </div>
        <DialogTrigger>
          <StyledButton onClick={handleSaveImage} className={styles.saveBtn}>
            Save Image
          </StyledButton>
        </DialogTrigger>
      </div>
    </DialogContent>
  );
};

export default ImageCropperModalContent;
