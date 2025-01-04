import { gql } from "@apollo/client";
import { BasicUserDetailsFragment } from "@/graphql/fragments/basic-user-details";
import { ApplicationInfoFragment } from "@/graphql/fragments/application-info";

export const fetchUserInfo = gql`
  query GetUserDetails {
    getUserDetails {
      ...BasicUserDetails
      ...ApplicationInfo
      profileImage
    }
  }
  ${BasicUserDetailsFragment}
  ${ApplicationInfoFragment}
`;
