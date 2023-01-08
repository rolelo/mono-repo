FROM node:18-alpine

#create app directory
WORKDIR /app
COPY ./packages/backend ./backend
COPY ./packages/common ./common
WORKDIR /app/backend
RUN npm install
WORKDIR /app/common
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "start"];
