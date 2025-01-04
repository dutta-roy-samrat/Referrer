"use client";

import { FC, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";

type ApolloGraphqlWrapperProps = {
  children: ReactNode;
};

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql/",
  credentials: "include",
});

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/",
  cache: new InMemoryCache(),
  link: httpLink,
});

const ApolloGraphqlWrapper: FC<ApolloGraphqlWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloGraphqlWrapper;
