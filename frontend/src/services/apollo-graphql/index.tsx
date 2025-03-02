"use client";

import { FC, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { GRAPHQL_URL } from "@/constants/environment-variables";

type ApolloGraphqlWrapperProps = {
  children: ReactNode;
};

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: "include",
});

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  link: httpLink,
});

const ApolloGraphqlWrapper: FC<ApolloGraphqlWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloGraphqlWrapper;
