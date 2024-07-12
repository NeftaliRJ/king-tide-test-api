ARG NODE_VERSION=18.17.1-alpine3.18

FROM node:${NODE_VERSION} AS builder

WORKDIR /usr/src/app

RUN corepack enable pnpm

COPY pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY ./src src

RUN pnpm fetch

ADD . ./

COPY package.json ./
RUN pnpm install -r

COPY . .

RUN pnpm run build

FROM node:${NODE_VERSION} AS runner

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 80

USER node

CMD [ "node", "dist/src/main" ]