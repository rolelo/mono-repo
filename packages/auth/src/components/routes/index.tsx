import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import Auth from '../auth';
import Confirm from '../confirm';
import Login from '../login';
import ResetPassword from "../reset-password";
import ResetPasswordCode from "../reset-password/Code";
import SignUp from '../signup';

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute />,
      children: [{
        path: 'auth',
        element: <Auth />,
        children: [{
          path: 'login',
          element: <Login />,
        }, {
          path: 'signup',
          element: <SignUp />,
        }, {
          path: 'confirm',
          element: <Confirm />,
        }, {
          path: 'reset-password',
          children: [{
            path: 'code',
            element: <ResetPasswordCode />
          },{
            path: '',
            element: <ResetPassword /> 
          }]
        }, {
          path: '',
          element: <Login />
        }],
      }],
    },
  ]);
  return element;
};

export default Routes;
