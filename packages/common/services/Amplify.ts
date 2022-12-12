import type { ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth, Hub } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs';
import { SignUp } from '../models/signUp';

export type UserAttributes = {
  email: string;
  email_verified: boolean;
  name: string;
  phone_number_verified: boolean;
  sub: string;
}
const userSubject = new BehaviorSubject<ISignUpResult | null>(null);
const userSignedIn = new BehaviorSubject<boolean | null>(null);
const userInfo = new BehaviorSubject<UserAttributes | null>(null);
async function signUp({
  email,
  name,
  password,
  phoneNumber,
}: Omit<SignUp, 'confirmPassword'>) {
  const user = await Auth.signUp({
    username: email,
    password,
    attributes: {
      email, // optional
      phone_number: phoneNumber, // optional - E.164 number convention
      name,
      // other custom attributes
    },
    autoSignIn: {
      // optional - enables auto sign in after user is confirmed
      enabled: true,
    },
  });

  userSubject.next(user);
  return user;
}

Hub.listen('auth', ({ payload }) => {
  const { event, data } = payload;
  if (event === 'autoSignIn' || event === 'signIn') {
    // assign user
    userSignedIn.next(true);
    userInfo.next({ ...data.attributes });
  } else if (event === 'autoSignIn_failure') {
    userSignedIn.next(false);
  }
  // redirect to sign in page
});

async function confirmSignUp(email: string, code: string) {
  await Auth.confirmSignUp(email, code);
}

async function resendConfirmationCode(email: string) {
  await Auth.resendSignUp(email);
}

async function verifyUser() {
  const user = await Auth.currentSession();
  const ui = await Auth.currentUserInfo();
  userInfo.next({ ...ui.attributes });

  return user.getIdToken().getJwtToken();
}

async function login(email: string, password: string) {
  await Auth.signIn(email, password);
}

async function signOut() {
  await Auth.signOut();
}

export default {
  userSubject,
  userSignedIn,
  userInfo,
  Auth,
  signUp,
  confirmSignUp,
  resendConfirmationCode,
  verifyUser,
  login,
  signOut,
};
