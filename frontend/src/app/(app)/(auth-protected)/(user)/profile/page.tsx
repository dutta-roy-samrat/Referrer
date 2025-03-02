import { FC } from "react";
import dynamic from "next/dynamic";

const ProfileSettings = dynamic(
  () => import("@/components/account-settings/profile"),
);

const ProfileSettingsPage: FC = () => <ProfileSettings />;

export default ProfileSettingsPage;
