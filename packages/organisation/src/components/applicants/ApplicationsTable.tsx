import { gql, useMutation, useQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { Box, Button, Chip, CircularProgress } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ApplicantStatus, Listing, ListingApplicant, UpdateApplicationStatusInput } from 'common/models';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const GET_APPLICANTS = gql`
query JobApplicants($jobId: String!) {
    jobApplicants(jobId: $jobId) {
      id
      createdDate
      status
      user {
        id
        name
        email
        phoneNumber
        profile {
          rightToWorkInUK
          rightToWorkInEU
          rightToWorkInUS
          cv
          countryOfResidence
          salaryLookingFor
          techSkills
          yearsOfExperience
        }
      }
    }
}
`;

const UPDATE_APPLICANT_STATUS = gql`
mutation UpdateApplicantStatus($input: UpdateApplicationStatusInput!) {
  updateApplicantStatus(input: $input) {
    status
  }
}
`

type Props = {
  handleRowClick: (listing: Listing) => void
}
const ApplicantsTable: React.FC<Props> = ({ handleRowClick }) => {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  const {
    data, loading, startPolling, stopPolling,
  } = useQuery<{ jobApplicants: ListingApplicant[] }, { jobId: string }>(GET_APPLICANTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      jobId: listingId || '',
    },
    onError: () => {
      toast.error('Listing not found');
      navigate('/listings');
    }
  });
  const [mutation] = useMutation<
    { updateApplicantStatus: ListingApplicant },
    { input: UpdateApplicationStatusInput }>(UPDATE_APPLICANT_STATUS)

  useEffect(() => {
    startPolling(3000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const gridRef = useRef<AgGridReact>();

  const handleUpdateStatus = (jobId: string | undefined, userId: string, status: ApplicantStatus): void => {
    if (!jobId) {
      toast.error('Listing Id undefined');
      return;
    }
    mutation({
      variables: {
        input: {
          status,
          jobId,
          userId,
        }
      }
    })
  }

  const columnDefs = useMemo<ColDef<ListingApplicant>[]>(() => ([
    {
      headerName: 'Status', width: 130, field: 'status', tooltipField: 'status', cellRenderer: ({ data: { status } }: { data: ListingApplicant }) => (
        <Chip
          style={{ borderRadius: '4px' }}
          label={status}
          color={
            status === ApplicantStatus.PENDING
              ? 'info'
              : status === ApplicantStatus.LISTED
                ? 'success'
                : 'error'
          }
          variant='filled'
        />
      )
    },
    {
      headerName: 'CV', width: 150, field: '', cellRenderer: ({ data }: { data: ListingApplicant }) => (
        <Button
          href={data.user.profile?.cv}
          target='_blank'
          referrerPolicy='no-referrer'
          component='a'
          size="small"
          variant="contained"
          color="primary">
          View CV
        </Button>
      ),
    },
    {
      headerName: 'Action', field: '', cellRenderer: ({ data }: { data: ListingApplicant }) => (
        <Box sx={{ display: "flex", height: "100%", flexDirection: "row", columnGap: "1rem", alignItems: "center" }}>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => handleUpdateStatus(listingId, data.user.id, ApplicantStatus.LISTED)}
          >
            <DoneIcon />
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleUpdateStatus(listingId, data.user.id, ApplicantStatus.REJECTED)}
          >
            <CancelIcon />
          </Button>
        </Box>
      ),
    },
    { headerName: 'Name', field: 'user.name', tooltipField: 'user.name' },
    { headerName: 'Email', field: 'user.email', tooltipField: 'user.email' },
    { headerName: 'Phone Number', field: 'user.phoneNumber', tooltipField: 'user.phoneNumber' },
    { headerName: 'RTW UK', field: 'user.profile.rightToWorkInUK', tooltipField: 'user.profile.rightToWorkInUK' },
    { headerName: 'RTW EU', field: 'user.profile.rightToWorkInEU', tooltipField: 'user.profile.rightToWorkInEU' },
    { headerName: 'RTW US', field: 'user.profile.rightToWorkInUS', tooltipField: 'user.profile.rightToWorkInUS' },
    { headerName: 'Country Of Residence', field: 'user.profile.countryOfResidence', tooltipField: 'user.profile.countryOfResidence' },
    { headerName: 'Expected Salary', field: 'user.profile.salaryLookingFor', tooltipField: 'user.profile.salaryLookingFor' },
    { headerName: 'Tech Skills', field: 'user.profile.techSkills', tooltipField: 'user.profile.techSkills' },
    { headerName: 'Years of Experience', field: 'user.profile.yearsOfExperience', tooltipField: 'user.profile.yearsOfExperience' },
    { headerName: 'Created Date', field: 'createdDate', tooltipField: 'createdDate' },
  ]), []);

  const defaultColDef = React.useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);

  if (loading) return <CircularProgress />;
  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        ref={gridRef as any}
        rowData={data?.jobApplicants.map(({ createdDate, ...rest }) => ({
          ...rest,
          createdDate: format(new Date(+createdDate), "dd/MM/yyyy"),
        }))
          || []
        }
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows
        rowSelection="multiple"
      />
    </div>
  );
};

export default ApplicantsTable;

