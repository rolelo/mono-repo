import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import Auth from '../auth';
import Confirm from '../confirm';
import Login from '../login';
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
          path: '',
          element: <Login />
        }],
      }],
    },
  ]);
  return element;
};

export default Routes;
