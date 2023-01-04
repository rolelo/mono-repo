/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const env = require(`./config.${process.env.REACT_APP_ENV}.json`);
interface CognitoConfig {
  poolId: string;
  clientId: string;
  storage: Storage;
}
// Default is development
const environmentVars = {
  REACT_APP_API_URL: env.url,
  REACT_APP_COGNITO: {
    poolId: env.REACT_APP_COGNITO.poolId,
    clientId: env.REACT_APP_COGNITO.clientId,
  },
  lambdaUrl: env.lambdaUrl,
  s3BucketUrl: env.S3_URL,
  serverUrl: env.SERVER_URL,
  serverUrlBase: env.SERVER_URL_BASE
};

export default environmentVars;
