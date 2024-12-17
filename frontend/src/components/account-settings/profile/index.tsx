import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ImageCropperModalContent from "@/components/account-settings/profile/image-cropper";

import { cn } from "@/lib/utils";
import CustomFileInput from "@/components/ui/custom-file-input";

interface ProfileFormData {
  name: string;
  email: string;
  resume: FileList | null;
  experience: string;
}

const ProfileSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmedFile, setConfirmedFile] = useState<File | null>(null);

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
            <CustomFileInput
              file={confirmedFile}
              handleImageUpload={handleImageUpload}
              label={
                <DialogTrigger>
                  <label
                    htmlFor="file"
                    className="block cursor-pointer border p-1 text-sm font-medium text-black"
                  >
                    Choose a file
                  </label>
                </DialogTrigger>
              }
            />
          </div>

          {imageSrc && (
            <ImageCropperModalContent
              imageSrc={imageSrc}
              setProfileImage={setProfileImage}
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
              className={cn(
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
              className={cn(
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
              className={cn(
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
};

export default ProfileSettings;
