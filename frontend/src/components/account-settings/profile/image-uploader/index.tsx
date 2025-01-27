import React, { useState } from "react";
import Image from "next/image";

import { DialogTrigger } from "@/components/ui/dialog";
import ImageCropperModalContent from "@/components/account-settings/profile/image-cropper";
import CustomFileInput from "@/components/ui/custom-file-input";

import styles from "./main.module.css";

interface ProfileImageUploaderProps {
  imageSrc: string;
  setImageSrc: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setConfirmedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProfileImage: (imgSrc: string) => void;
  selectedFile: File | null;
  confirmedFile: File | null;
  profileImage: string;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  imageSrc,
  setImageSrc,
  setSelectedFile,
  setConfirmedFile,
  setProfileImage,
  selectedFile,
  confirmedFile,
  profileImage,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setConfirmedFile(null);
    setProfileImage("");
    setSelectedFile(null);
    setImageSrc("");
  };

  const handleImageEdit = (e: React.MouseEvent) => {
    setSelectedFile(confirmedFile);
  };

  return (
    <div className={styles.uploaderContainer}>
      <div>
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            className={styles.profileImage}
            width="100"
            height="100"
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <CustomFileInput
        file={confirmedFile}
        handleInputChange={handleImageUpload}
        label={
          <DialogTrigger>
            <label htmlFor="profileImage" className={styles.dialogTrigger}>
              Choose a file
            </label>
          </DialogTrigger>
        }
        inputId="profileImage"
        className={styles.fileInput}
        inputProps={{ accept: "image/*" }}
      />
      <div className={styles.imageCustomizationBtnGroup}>
        <button onClick={handleImageRemove}>Remove</button>
        {profileImage && (
          <DialogTrigger onClick={handleImageEdit}>Edit</DialogTrigger>
        )}
      </div>
      {selectedFile && (
        <ImageCropperModalContent
          imageSrc={imageSrc}
          setProfileImage={setProfileImage}
          setConfirmedFile={setConfirmedFile}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          crop={crop}
          setCrop={setCrop}
          zoom={zoom}
          setZoom={setZoom}
        />
      )}
    </div>
  );
};

export default ProfileImageUploader;
