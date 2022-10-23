import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import React, { useEffect, useRef, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const GET_USER_ORGANISATIONS = gql`
query GetUser {
    user {
        organisations {
            _id,
            name,
            admin {
              name
            },
            website,
            email,
            createdDate,
            totalPositions
        }
    }
}
`;

const View: React.FC = () => {
  const {
    data, loading, startPolling, stopPolling,
  } = useQuery(GET_USER_ORGANISATIONS, {
    fetchPolicy: 'cache-and-network',
  });

  // useEffect(() => {
  //   startPolling(3000);
  //   return () => {
  //     stopPolling();
  //   };
  // }, []);
  const gridRef = useRef<AgGridReact>();
  const [rowData, setRowData] = useState([]);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { headerName: 'Name', field: 'name' },
    { headerName: 'Owner', field: 'admin.name' },
    { headerName: 'Website', field: 'website' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Created Date', field: 'createdDate' },
    { headerName: 'Total Positions', field: 'totalPositions' },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = React.useMemo(() => ({
    sortable: true,
  }), []);

  if (loading) return <CircularProgress />;
  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef as any} // Ref for accessing Grid's API
          rowData={data?.user?.organisations || []} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
        />
      </div>
    </div>
  );
};

export default View;
