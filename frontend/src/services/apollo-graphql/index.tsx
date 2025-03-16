"use client";

import { FC, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";

import { getCookie } from "@/helpers/cookie";

import { GRAPHQL_URL } from "@/constants/environment-variables";

type ApolloGraphqlWrapperProps = {
  children: ReactNode;
};

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = getCookie("access");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});

const ApolloGraphqlWrapper: FC<ApolloGraphqlWrapperProps> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloGraphqlWrapper;
