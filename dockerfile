FROM node:19-slim
#create app directory
RUN apt-get update || : && apt-get install python -y
WORKDIR /app
COPY ./packages/backend ./packages/backend
COPY ./packages/common ./packages/common
COPY ./lerna.json .
COPY ./yarn.lock .
COPY ./nx.json .
COPY ./package.json .
RUN yarn global add lerna
RUN yarn global add @babel/cli
RUN yarn
RUN yarn lerna bootstrap --include-dependencies
EXPOSE 8080
CMD ["yarn", "lerna", "run", "start", "--scope", "backend", "--verbose"];
