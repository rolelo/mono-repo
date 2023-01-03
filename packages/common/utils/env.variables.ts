// Default is development
const environmentVars = {
  REACT_APP_COGNITO: {
    poolId: process.env.POOL_ID,
    clientId: process.env.CLIENT_ID
  },
  s3BucketUrl: process.env.S3_URL,
  serverUrl: `${process.env.BACKENDURL}/graphql`,
  serverUrlBase: process.env.BACKEND_URL
};

export default environmentVars;
