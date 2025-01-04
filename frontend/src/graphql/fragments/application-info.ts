import { gql } from "@apollo/client";

export const ApplicationInfoFragment = gql`
  fragment ApplicationInfo on UserDetailsType {
    id
    resume
    experience
  }
`;
