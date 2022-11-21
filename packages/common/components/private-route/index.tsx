import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Amplify, { UserAttributes } from 'common/services/Amplify';
import { Auth } from 'aws-amplify';

export const UserInformationContext = React.createContext<UserAttributes | null>(null);

type Props = {
  redirectUrl?: string
}
const PrivateRoute: React.FC<Props> = ({ redirectUrl }) => {
  const [userAttributes, setUserAttributes] = React.useState<UserAttributes | null>(null);
  const location = useLocation();
  const { mutate } = useMutation(() => Auth.currentAuthenticatedUser(), {
    onError: () => {
      if (!location.pathname.includes('/auth') && redirectUrl) {
        window.location.href = `https://localhost:3000/auth/login?redirectUrl=${redirectUrl}`
      }
    },
  });

  useEffect(() => {
    mutate();

    const userAttributesSubscription = Amplify.userInfo.subscribe((ui) => {
      setUserAttributes(ui);
    });

    return () => userAttributesSubscription.unsubscribe();
  }, [location.pathname, mutate]);
  return (
    <UserInformationContext.Provider value={userAttributes}>
      <Outlet />
    </UserInformationContext.Provider>
  );
};

export default PrivateRoute;
