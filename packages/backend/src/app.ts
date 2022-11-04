import { makeExecutableSchema } from '@graphql-tools/schema';
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
import * as resolvers from './resolvers';
const {loadFiles} = require('@graphql-tools/load-files');
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

  const typeDefs = await loadFiles('./**/*.graphql');
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [
      resolvers.userResolvers.resolvers,
      resolvers.oganisationResolvers.resolvers,
      resolvers.listingResolvers.resolvers,
      resolvers.jobApplicationResolvers.resolvers,
    ],
  });
  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
    cache: 'bounded',
    context: async ({req}): Promise<Context> => {
      const token = req.headers.authorization;
      try {
        const payload = await verifier.verify(token);
        return {
          sub:  payload.sub,
          name: payload.name.toString(),
          email: payload.email.toString(),
          // sub:  '6b9e61bc-374e-4669-9ed8-2bf42a1c0812', //payload.sub,
          // name: 'Amir Shojae', //payload.name.toString(),
          // email: 'amiralishojaee123@gmail.com', //payload.email.toString(),
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
