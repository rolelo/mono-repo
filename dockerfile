FROM node:18-alpine

#create app directory
WORKDIR /app
COPY . .
RUN yarn global add lerna
RUN yarn global add @babel/cli
RUN yarn
EXPOSE 8080
CMD ["yarn", "lerna", "run", "start", "--scope", "backend", "--verbose"];
