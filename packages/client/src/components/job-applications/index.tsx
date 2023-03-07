import { gql, useLazyQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import { ApplicantStatus, IApplicant } from 'common/models';
import { useUpdateApplicantStatus } from 'common/hooks'; 
import { format } from 'date-fns';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS


const GET_JOB_APPLICATIONS = gql`
  query JobApplications {
    jobApplications {
      id
      jobId
      createdDate
      status
    }
  }
`

const JobApplications = () => {
  const gridRef = useRef<AgGridReact>();

  const navigate = useNavigate();
  const [query, { data, startPolling, stopPolling }] = useLazyQuery<{
    jobApplications: IApplicant[]
  }>(GET_JOB_APPLICATIONS);
  const { mutation } = useUpdateApplicantStatus();

  useEffect(() => {
    startPolling(3000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);
  const columnDefs = useMemo<ColDef[]>(() => ([
    {
      headerName: 'Job', field: 'jobId', cellRenderer: ({
        data }: { data: IApplicant }) => (
        <Button
          onClick={
            () => navigate(`/listing/${data.jobId}`)
          }
          size="small"
          variant="contained"
          color="primary">
          View Position
        </Button>
      )
    },
    {
      headerName: 'Application Status', field: 'status', cellRenderer: ({ data }: { data: IApplicant }) => (
        <Chip label={data.status} sx={{
          borderRadius: '5px'
        }} color={
          data.status === ApplicantStatus.PENDING
            ? 'default'
            : data.status === ApplicantStatus.REJECTED
              ? 'error'
              : 'success'} />
      )
    },
    {
      headerName: 'Reject Application', field: '', cellRenderer: ({ data }: { data: IApplicant }) => (
        <Box sx={{ display: "flex", height: "100%", flexDirection: "row", columnGap: "1rem", alignItems: "center" }}>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => mutation({
              variables: {
                input: {
                  jobId: data.jobId!,
                }
              }
            })}
          >
            <CancelIcon />
          </Button>
        </Box>
      ),
    },
    { headerName: 'Created Date', field: 'createdDate', tooltipField: 'createdDate' },
  ]), [navigate]);

  useEffect(() => {
    query();
  }, [query])

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef as any} // Ref for accessing Grid's API
        rowData={data?.jobApplications.map(({ createdDate, ...rest }) => ({
          ...rest,
          createdDate: format(new Date(+createdDate), "dd/MM/yyyy"),
        }))
          || []
        } // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
      />
    </div>
  )
}

export default JobApplications