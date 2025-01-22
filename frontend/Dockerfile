# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.11.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

FROM base AS deps

COPY ./package.json ./package-lock.json  ./yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

FROM deps as build

COPY . .

RUN yarn run build


FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next


# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD yarn start
