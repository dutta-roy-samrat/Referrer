import { gql } from "@apollo/client";
import { BasicUserDetailsFragment } from "@/graphql/fragments/basic-user-details";

export const fetchBasicUserInfo = gql`
  query GetBasicUserDetails {
    getUserDetails {
      ...BasicUserDetails
    }
  }
  ${BasicUserDetailsFragment}
`;
