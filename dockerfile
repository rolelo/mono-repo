FROM node:19-alpine
WORKDIR /app
RUN yarn global add lerna
RUN yarn global add @babel/cli
COPY ./packages/backend ./packages/backend
COPY ./packages/common ./packages/common
COPY ./lerna.json .
# COPY ./yarn.lock .
COPY ./nx.json .
COPY ./package.json .
RUN yarn --network-timeout=30000
EXPOSE 8080
CMD ["yarn", "lerna", "run", "start", "--scope", "backend", "--verbose"];
