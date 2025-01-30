FROM node:22.11.0-alpine AS base

WORKDIR /app
COPY ./package.json ./package-lock.json  ./yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

FROM node:22.11.0-alpine AS build
WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./node_modules
RUN yarn build


FROM node:22.11.0-alpine  AS final

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/.next/standalone ./.next/standalone
COPY --from=build /app/.next/static ./.next/standalone/.next/static

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node .next/standalone/server.js