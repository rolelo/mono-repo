import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute redirectUrl="https://localhost:3001" />,
      children: [{
        path: '/',
        element: <DashboardLayout />,
        children: [],
      }],
    }
  ]);
  return element;
};

export default Routes;
