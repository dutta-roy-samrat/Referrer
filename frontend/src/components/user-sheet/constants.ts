export const USER_SHEET_LINKS = [
  {
    url: "/profile",
    label: "Profile",
  },
  {
    url: "/reset-password/",
    label: "Change Password",
  },
];

export const getResponsiveUserLinks = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => [
  {
    label: "Account Settings",
    url: "",
  },
  ...USER_SHEET_LINKS,
  {
    label: " Quick Links",
    url: "",
  },
  {
    url: "/feed",
    label: "Feed",
  },
  ...(isAuthenticated
    ? [
        {
          url: "/",
          label: "Dashboard",
        },
        {
          url: "/my-posts",
          label: "My Posts",
        },
      ]
    : []),
];
