import { gql, useQuery } from '@apollo/client';
import { Box, Typography, Chip } from '@mui/material';
import { EmploymentStatus, IListing, LinkedInJobFunctionCodes } from 'common/models';
import { useParams } from 'react-router-dom';

const GET_LISTING = gql`
  query clientListing($id: String!) {
    clientListing(id: $id) {
      _id
      organisationName
      organisationLogo
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

const Listing: React.FC = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ clientListing: IListing }>(GET_LISTING, {
    variables: {
      id,
    },
    onError: (error) => {
      console.log(error.networkError);
    }
  });
  return (
    <Box sx={{ padding: '2rem', boxSizing: 'border-box', backgroundColor: 'white', width: '70vw', borderRadius: '8px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '2rem', alignItems: 'center', }}>
          <img src={data?.clientListing.organisationLogo} alt="Organisation Logo" width="70px" />
          <Typography variant='h4' fontWeight="500">{data?.clientListing.title}</Typography>
        </Box>
        <Typography variant="h4" fontWeight="bolder">{`${data?.clientListing.currency}-${data?.clientListing.salary}`}</Typography>
      </Box>
      <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>About</Typography>
      <Typography variant='h5' fontWeight="300">{data?.clientListing.organisationDescription}</Typography>

      <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>Job Description</Typography>
      <Typography variant='h5' fontWeight="300">{data?.clientListing.description}</Typography>

      <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>Skills Description</Typography>
      <Typography variant='h5' fontWeight="300">{data?.clientListing.skillsDescription}</Typography>

      <Box sx={{ display: "flex", flexDirection: 'row', columnGap: '1.5rem', margin: '2rem 0' }}>
        <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#EEEEEE", padding: '1rem', borderRadius: "8px" }}>
          <Typography variant='h6' fontWeight="600">Experience Level</Typography>
          <Typography variant='h6' fontWeight="400">{data?.clientListing.experienceLevel}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#EEEEEE", padding: '1rem', borderRadius: "8px" }}>
          <Typography variant='h6' fontWeight="600">Workplace Type</Typography>
          <Typography variant='h6' fontWeight="400">{data?.clientListing.workplaceType}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#EEEEEE", padding: '1rem', borderRadius: "8px" }}>
          <Typography variant='h6' fontWeight="600">Location</Typography>
          <Typography variant='h6' fontWeight="400">{data?.clientListing.location}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#EEEEEE", padding: '1rem', borderRadius: "8px" }}>
          <Typography variant='h6' fontWeight="600">Employment Status</Typography>
          <Typography variant='h6' fontWeight="400">{EmploymentStatus[data?.clientListing.employmentStatus as keyof typeof EmploymentStatus]}</Typography>
        </Box>
      </Box>

      <Box style={{ padding: '2rem 0 1rem 0' }}>
        <Typography variant='h5' fontWeight="600" style={{ padding: "2rem 0 1rem 0"}}>About</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", columnGap: "0.5rem", rowGap: "1rem" }}>
          {data?.clientListing.categories.map((c) => (
            <Chip sx={{ fontSize: "1.2rem", fontWeight: "400" }} label={LinkedInJobFunctionCodes[c]} />
          ))}
        </Box>
      </Box>
      <Typography variant='h3'>Job Listing: {data?.clientListing.organisationWebsite}</Typography>
      <Typography variant='h3'>Job Listing: {data?.clientListing.categories.map((c) => LinkedInJobFunctionCodes[c])}</Typography>
      <Typography variant='h3'>Job Listing: {data?.clientListing.categories}</Typography>
      <Typography variant='h3'>Job Listing: {data?.clientListing.createdDate}</Typography>

    </Box>
  )
}

export default Listing