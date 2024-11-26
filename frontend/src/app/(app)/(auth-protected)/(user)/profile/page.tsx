"use client";

import React, { useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Cropper from "react-easy-crop";
import clsx from "clsx";
import "tailwindcss/tailwind.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Define types for the form data
interface ProfileFormData {
  name: string;
  email: string;
  resume: FileList | null;
  experience: string;
}

const CropperModal = ({
  imageSrc,
  setProfileImage,
  setImageSelected,
  setImageSrc,
  setSelectedFile,
  selectedFile,
  setConfirmedFile,
}: any) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.src = url;
    });
  };

  const getCroppedImage = async (): Promise<Blob> => {
    const image = await createImage(imageSrc as string);
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
    setConfirmedFile(selectedFile);
    setImageSrc(null);
    setSelectedFile(null);
  };

  return (
    <DialogContent
      onClose={() => {
        setImageSrc(null);
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

export default function ProfileUpdate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmedFile, setConfirmedFile] = useState<File | null>(null);

  console.log(imageSrc);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
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

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    console.log("Updated Profile:", data);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-black">Update Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Dialog>
          <div className="flex items-center space-x-4">
            <div className="relative h-24 w-24">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                  No Image
                </div>
              )}
            </div>
            <div className="flex items-center">
              <DialogTrigger>
                <label
                  htmlFor="file"
                  className="block cursor-pointer border p-1 text-sm font-medium text-black"
                >
                  Choose a file
                </label>
              </DialogTrigger>
              <input
                id="file"
                type="file"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-sm text-black">
                {confirmedFile
                  ? `Selected File: ${confirmedFile.name}`
                  : "No file chosen"}
              </div>
            </div>
          </div>

          {imageSrc && (
            <CropperModal
              imageSrc={imageSrc}
              setProfileImage={setProfileImage}
              // setImageSelected={setImageSelected}
              setImageSrc={setImageSrc}
              setConfirmedFile={setConfirmedFile}
              setSelectedFile={setSelectedFile}
              selectedFile={selectedFile}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={clsx(
                "mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm",
                errors.name ? "border-red-500" : "border-gray-400",
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className={clsx(
                "mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm",
                errors.email ? "border-red-500" : "border-gray-400",
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              {...register("resume")}
              className="block w-full cursor-pointer rounded-lg border border-gray-400 bg-gray-200 text-sm text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Experience
            </label>
            <textarea
              {...register("experience", {
                required: "Experience is required",
              })}
              rows={4}
              className={clsx(
                "mt-1 block w-full rounded-md border px-4 py-2 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm",
                errors.experience ? "border-red-500" : "border-gray-400",
              )}
            ></textarea>
            {errors.experience && (
              <p className="mt-1 text-sm text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </Dialog>
      </form>
    </div>
  );
}
