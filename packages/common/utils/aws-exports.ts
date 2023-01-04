import environmentVars from './env.variables';

console.log(environmentVars);
const awsExports = {
  Auth: {
    userPoolId: environmentVars.REACT_APP_COGNITO.poolId,
    userPoolWebClientId: environmentVars.REACT_APP_COGNITO.clientId,
    cookieStorage: {
      domain: window.location.hostname, //localhost or .<domain>.com`
      path: "/",
      expires: 365,
      sameSite: "strict",
      secure: false,
    },
  },
  oauth: {
    domain: "rolelo.auth.eu-west-1.amazoncognito.com",
    scope: ["email", "profile", "openid", "aws.cognito.signin.user.admin"],
    redirectSignIn: `${window.location.hostname}/auth/login`,
    redirectSignOut: `${window.location.hostname}/auth/login`,
    responseType: "code",
  },
};

export default awsExports;
