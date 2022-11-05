import { gql, useQuery } from '@apollo/client';
import { Alert, Box, Button, Paper, Typography, Divider } from '@mui/material';
import { IJobApplication } from 'common/models';
import { format } from 'date-fns';
import React from 'react';

type Props = {
  jobId: string
}

const GET_APPLICANTS = gql`
  query JobApplicants($jobId: String!) {
    jobApplicants(jobId: $jobId) {
      name
      email
      cvUrl
      createdDate
    }
  }
`;

const Applicant: React.FC<IJobApplication> = ({ createdDate, cvUrl, email, name }) => (
  <Paper elevation={3} sx={{
    padding: "1rem",
    backgroundColor: "#f2f2f2",
    transition: '0.2s ease-in-out',
    '&:hover': {
      backgroundColor: "#EEEEEE",
    }
  }}>
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", height: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem", justifyContent: "center" }}>
        <Typography fontWeight={600}>{name}</Typography>
        <Typography fontWeight={600}>{email}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem", justifyContent: "center" }}>
        <Button color="primary" variant="contained" sx={{ padding: 0 }}>
          <a href={cvUrl} target="_blank" rel="noreferrer" style={{ padding: "1rem", textDecoration: "none", color: "white" }}>
            View CV
          </a>
        </Button>
        <Typography fontWeight={600}>{format(new Date(+createdDate), "dd/MM/yyyy")}</Typography>
      </Box>
    </Box>
    <Divider sx={{ margin: '2rem 0' }} />
    <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end", columnGap: "1rem" }}>
      <Button variant="contained" color="error">Decline</Button>
      <Button variant="contained" color="success" component={'a'} href={`mailto:${email}`}>Email participant</Button>
      <Button variant="contained" color="success" component={'a'} href={`tel:${email}`}>Call participant</Button>
    </Box>
  </Paper>
)

const Applicants: React.FC<Props> = ({ jobId }) => {
  const { data } = useQuery<{ jobApplicants: IJobApplication[] }, { jobId: string }>(GET_APPLICANTS, {
    variables: {
      jobId
    },
    pollInterval: 1000,
  });

  if (data?.jobApplicants.length === 0) {
    return <Alert severity="info">You currently do not have any applicants for this position!</Alert>
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <Alert sx={{ margin: '1rem 0' }} severity="success">You have {data?.jobApplicants.length} applicants for this position!</Alert>
      {data?.jobApplicants.map((ja) => <Applicant key={ja.cvUrl} {...ja} />)}
    </Box>
  )
}

export default Applicants