import { CircularProgress, Button } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import { Listing } from 'common/models';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetListings from '../../hooks/useGetListings';

type Props = {
  handleRowClick: (listing: Listing) => void
}
const ListingsTable: React.FC<Props> = ({ handleRowClick }) => {
  const navigate = useNavigate();
  const { data, loading, startPolling, stopPolling } = useGetListings();

  useEffect(() => {
    startPolling(3000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const gridRef = useRef<AgGridReact>();

  // Each Column Definition results in one Column.
  const columnDefs = useMemo<ColDef[]>(() => ([
    {
      headerName: 'Title', field: 'title', tooltipField: 'title', cellRenderer: ({ data }: { data: Listing }) => (
        <Button sx={{ padding: 0 }} onClick={() => handleRowClick(data)} variant='text' color='info'>{data.title}</Button>
      )
    },
    { headerName: 'Organisation Name', field: 'organisationName', tooltipField: 'organisationName' },
    { headerName: 'Advertising Mediums', field: 'advertisingMediums', tooltipField: 'advertisingMediums' },
    { headerName: 'Employment Status', field: 'employmentStatus', tooltipField: 'employmentStatus' },
    { headerName: 'Created By', field: 'createdByName', tooltipField: 'createdByName' },
    { headerName: 'Expire At', field: 'expireAt', tooltipField: 'expireAt' },
    { headerName: 'Created Date', field: 'createdDate', tooltipField: 'createdDate' },
    {
      headerName: 'Created Date', width: 150, field: '', cellRenderer: ({ data }: { data: Listing }) => (
        <Button onClick={() => navigate(`/listings/${data._id}/applicants`)} size="small" variant="contained" color="primary">View Applicants</Button>
      ),
    }
  ]), [handleRowClick, navigate]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = React.useMemo(() => ({
    sortable: true,
  }), []);

  if (loading) return <CircularProgress />;
  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef as any} // Ref for accessing Grid's API
        rowData={data?.listings.map(({ createdDate, expireAt, ...rest }) => ({
          ...rest,
          createdDate: format(new Date(+createdDate), "dd/MM/yyyy"),
          expireAt: format(new Date(+expireAt), "dd/MM/yyyy"),
        }))
          || []
        } // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        onGridReady={(event) => {
          event.api.sizeColumnsToFit();
        }}
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
      />
    </div>
  );
};

export default ListingsTable;
