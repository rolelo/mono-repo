import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";
import Organisation from "../organisation";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute />,
      children: [{
        path: '/',
        element: <DashboardLayout />,
        children: [{
          path: 'organisation',
          element: <Organisation />,
        }],
      }],
    }
  ]);
  return element;
};

export default Routes;
