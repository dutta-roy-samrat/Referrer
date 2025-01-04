import { gql } from "@apollo/client";
import { ApplicationInfoFragment } from "@/graphql/fragments/application-info";

export const fetchApplicationInfo = gql`
  query GetApplicationInfo {
    getUserDetails {
      ...ApplicationInfo
    }
  }
  ${ApplicationInfoFragment}
`;
