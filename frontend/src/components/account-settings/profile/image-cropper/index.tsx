import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FC, useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

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
      <div className="relative mt-4 w-full bg-gray-300">
        <div className="flex flex-col items-center">
          <div
            className="w-full"
            style={{ position: "relative", height: "400px" }}
          >
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
            <button
              type="button"
              onClick={handleSaveImage}
              className="mt-4 rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Save Image
            </button>
          </DialogTrigger>
        </div>
      </div>
    </DialogContent>
  );
};

export default ImageCropperModalContent;
