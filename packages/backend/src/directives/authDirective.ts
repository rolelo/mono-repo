import { GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { AuthenticationError } from "apollo-server-core";
import * as dotenv from "dotenv";

import { Context } from "../../../common/models";

dotenv.config();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USERPOOL_ID,
  tokenUse: process.env.TOKEN_USE as "id" | "access",
  clientId: process.env.CLIENT_ID,
});

function authDirective(
  directiveName: string,
  getUserFn: (token: string) => Promise<Context>
) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
      requires: Role = ADMIN,
    ) on OBJECT | FIELD_DEFINITION
 
    enum Role {
      ADMIN
      REVIEWER
      USER
      UNKNOWN
    }`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];
          if (authDirective) {
            const { requires } = authDirective;
            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = async function (source, args, context, info) {
                const user = await getUserFn(context.headers.authorization);
                if (!user.sub) {
                  throw new Error("not authorized");
                }
                return resolve(source, args, { ...context, ...user }, info);
              };
              return fieldConfig;
            }
          }
        },
      }),
  };
}

const getUser = async (token: string): Promise<Context> => {
  try {
    const payload = await verifier.verify(token);
    return {
      sub: payload.sub,
      name: payload.name.toString(),
      email: payload.email.toString(),
    };
  } catch (err) {
    throw new AuthenticationError("Unauthorized");
  }
};


const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective(
  "auth",
  getUser
);

export default {
  authDirectiveTypeDefs,
  authDirectiveTransformer,
}