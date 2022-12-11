import { Box } from "@mui/material";
import PrivateRoute from "common/components/private-route";
import Search from "common/components/search";
import { useRoutes, Outlet } from 'react-router-dom';
import DashboardLayout from "../dashboard/layout";
import JobApplications from "../job-applications";
import Listing from "../listing";
import SearchResults from "../search-results";

const Routes = () => {
  const element = useRoutes([
    {
      path: '/home',
      element: <Search home={true} />
    },
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
        }, {
          path: '/jobs',
          element: <Box sx={{ padding: '2rem' }}><Outlet /></Box>,
          children: [{
            path: '/jobs/applied',
            element: <JobApplications />
          }]
        }],
      }],
    }
  ]);
  return element;
};

export default Routes;
