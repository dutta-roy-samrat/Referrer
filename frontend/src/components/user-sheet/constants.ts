export const USER_SHEET_LINKS = [
  {
    url: "/profile",
    label: "Profile",
  },
  {
    url: "/password",
    label: "Password",
  },
];


export const getResponsiveUserLinks = ({ isAuthenticated }) => [
  {
    label: "Account Settings",
    url: ""
  },
  ...USER_SHEET_LINKS,
  {
    label: " Quick Links",
    url: ""
  },
  {
    url: "/feed",
    label: "Feed",
  },
  ...isAuthenticated ? [{
    url: "/",
    label: "Dashboard",
  }, {
    url: "/my-posts",
    label: "My Posts",
  }] : []
]