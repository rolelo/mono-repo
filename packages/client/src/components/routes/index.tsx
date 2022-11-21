import PrivateRoute from "common/components/private-route";
import Search from "common/components/search";
import { useRoutes } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";
import Listing from "../listing";
import SearchResults from "../search-results";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <PrivateRoute />,
      children: [{
        path: '/',
        element: <DashboardLayout />,
        children: [{
          path: '/listing/:id',
          element: <Listing />
        }, {
          path: '/search',
          element: <SearchResults />
        }, {
          path: '/',
          element: <Search />
        }],
      }],
    }
  ]);
  return element;
};

export default Routes;
