import React, { useEffect } from 'react';
import { useMutation } from 'react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Amplify, { UserAttributes } from 'common/services/Amplify';

export const UserInformationContext = React.createContext<UserAttributes | null>(null);

const PrivateRoute: React.FC = () => {
  const [userAttributes, setUserAttributes] = React.useState<UserAttributes | null>(null);
  const navigator = useNavigate();
  const location = useLocation();
  const { mutate } = useMutation(() => Amplify.verifyUser(), {
    onSuccess: () => {
      if (location.pathname === '/') {
        navigator('/dashboard');
      }
    },
    onError: () => {
      if (!location.pathname.includes('/auth')) {
        window.location.href = "https://localhost:3000/auth/login"
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
