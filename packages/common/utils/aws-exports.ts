
const awsExports = {
  Auth: {
    userPoolId: process.env.REACT_APP_COGNITO_POOLID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
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
