import environmentVars from './env.variables';

const awsExports = {
  Auth: {
    userPoolId: environmentVars.REACT_APP_COGNITO.poolId,
    userPoolWebClientId: environmentVars.REACT_APP_COGNITO.clientId,
    cookieStorage: {
      domain: "localhost", //localhost or .<domain>.com`
      path: "/",
      expires: 365,
      sameSite: "strict",
      secure: false,
    },
  },
  oauth: {
    domain: "rolelo.auth.eu-west-1.amazoncognito.com",
    scope: ["email", "profile", "openid", "aws.cognito.signin.user.admin"],
    redirectSignIn: "https://localhost:3000/auth/login",
    redirectSignOut: "https://localhost:3000/auth/login",
    responseType: "code",
  },
};

export default awsExports;
