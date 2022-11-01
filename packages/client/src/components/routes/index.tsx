import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";
import Listing from "../listing";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute redirectUrl="https://localhost:3001" />,
      children: [{
        path: '/',
        element: <DashboardLayout />,
        children: [{
          path: '/listing/:id',
          element: <Listing />
        }],
      }],
    }
  ]);
  return element;
};

export default Routes;
