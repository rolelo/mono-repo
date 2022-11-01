import PrivateRoute from "common/components/private-route";
import { useRoutes } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";
import Listings from "../listings";
import NewListing from "../new-listing";
import Organisation from "../organisation";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute redirectUrl="https://localhost:3001" />,
      children: [{
        path: '/',
        element: <DashboardLayout />,
        children: [{
          path: 'organisation',
          element: <Organisation />,
        }, {
          path: 'new-listing',
          element: <NewListing />
          }, {
          path: 'listings',
            element: <Listings />
        }],
      }],
    }
  ]);
  return element;
};

export default Routes;
