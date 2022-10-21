import environmentVars from './env.variables';

const awsExports = {
  Auth: {
    userPoolId: environmentVars.REACT_APP_COGNITO.poolId,
    userPoolWebClientId: environmentVars.REACT_APP_COGNITO.clientId,
    cookieStorage: {
      domain: 'localhost', //localhost or .<domain>.com
      path: "/",
      expires: 365,
      sameSite: "strict",
      secure: false,
    },
  },
};

export default awsExports;
