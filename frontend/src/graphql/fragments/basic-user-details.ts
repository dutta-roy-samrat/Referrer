import { gql } from "@apollo/client";

export const BasicUserDetailsFragment = gql`
  fragment BasicUserDetails on UserDetailsType {
    id
    firstName
    lastName
    email
    profileImage
  }
`;
