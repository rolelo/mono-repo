import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import { IListing } from 'common/models';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef } from 'react';

const GET_LISTINGS = gql`
query Listings {
    listings {
      _id
      organisationName
      organisationDescription
      organisationWebsite
      createdDate
      createdById
      createdByName
      jobPostingOperationType
      title
      advertisingMediums
      description
      location
      categories
      skillsDescription
      workRemoteAllowed
      workplaceType
      employmentStatus
      experienceLevel
      expireAt
      listingType
      currency
      salary
    }
}
`;

type Props = {
  handleRowClick: (listing: IListing) => void
}
const ListingsTable: React.FC<Props> = ({ handleRowClick }) => {
  const {
    data, loading, startPolling, stopPolling,
  } = useQuery<{ listings: IListing[] }>(GET_LISTINGS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    startPolling(3000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const gridRef = useRef<AgGridReact>();

  // Each Column Definition results in one Column.
  const columnDefs = useMemo<ColDef[]>(() => ([
    { headerName: 'Title', field: 'title' },
    { headerName: 'Organisation Name', field: 'organisationName' },
    { headerName: 'Advertising Mediums', field: 'advertisingMediums' },
    { headerName: 'Employment Status', field: 'employmentStatus' },
    { headerName: 'Created By', field: 'createdByName' },
    { headerName: 'Expire At', field: 'expireAt' },
    { headerName: 'Created Date', field: 'createdDate' },
  ]), []);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = React.useMemo(() => ({
    sortable: true,
  }), []);

  if (loading) return <CircularProgress />;
  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef as any} // Ref for accessing Grid's API
        onRowClicked={({ data }) => handleRowClick(data)}
        rowData={data?.listings.map(({ createdDate, expireAt, ...rest }) => ({
          ...rest,
          createdDate: format(new Date(+createdDate), "dd/MM/yyyy"),
          expireAt: format(new Date(+expireAt), "dd/MM/yyyy"),
        }))
          || []
        } // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
      />
    </div>
  );
};

export default ListingsTable;
