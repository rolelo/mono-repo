import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute />,
      children: [{
        path: '/',
        element: <DashboardLayout />,
        children: [{
          path: 'dashboard',
          index: true,
          element: <h2>Hello World</h2>,
        }],
      }],
    },
  ]);
  return element;
};

export default Routes;
