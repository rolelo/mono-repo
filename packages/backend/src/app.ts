import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { S3Client } from "@aws-sdk/client-s3";
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import schema from './schema';

const cors = require('cors');

export const s3Client = new S3Client({
  region: "eu-west-1",
});

const startApolloServer = async () => {
  await mongoose.connect(
    `mongodb://root:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}:27017`
  );
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
    cache: "bounded",
    context: ({ req }) => ({
          headers: req.headers,
    }),
    plugins: [
      // eslint-disable-next-line new-cap
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // eslint-disable-next-line new-cap
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  app.use(cors());
  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({port: 8080}, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`);
};

startApolloServer();
