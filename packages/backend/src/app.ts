import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { CognitoJwtVerifier } from 'aws-jwt-verify/cognito-verifier';
import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Context } from '../../common/models';
import schema from './schema';
const cors = require('cors');

dotenv.config();

export const s3Client = new AWS.S3({
  region: "eu-west-1",
});


const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USERPOOL_ID,
  tokenUse: process.env.TOKEN_USE as 'id' | 'access',
  clientId: process.env.CLIENT_ID,
});

const startApolloServer = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
    cache: 'bounded',
    context: async ({req}): Promise<Context> => {
      const token = req.headers.authorization;
      try {
        const payload = await verifier.verify(token);
        return {
          headers: req.headers,
          sub:  payload.sub,
          name: payload.name.toString(),
          email: payload.email.toString(),
        };
      } catch (err) {
        throw new AuthenticationError('Unauthorized');
      }
    },
    plugins: [
      // eslint-disable-next-line new-cap
      ApolloServerPluginDrainHttpServer({httpServer}),
      // eslint-disable-next-line new-cap
      ApolloServerPluginLandingPageLocalDefault({embed: true}),
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
