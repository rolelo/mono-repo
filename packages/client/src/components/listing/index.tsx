import { gql, useQuery } from '@apollo/client';
import { styled } from '@mui/system';
import { Box, Typography, Chip, Button } from '@mui/material';
import { EmploymentStatus, IListing, LinkedInJobFunctionCodes } from 'common/models';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import DirectApply from '../direct-apply';

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

const LeftPane = styled('div')({
  boxSizing: 'border-box',
  flex: '0.5',
  borderRadius: '8px',
  height: '200px'
});

const RightPane = styled('div')({
  padding: '2rem',
  boxSizing: 'border-box',
  flex: '1.2',
  backgroundColor: 'white',
  borderRadius: '8px'
});

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
    <Box sx={{ padding: '2rem', display: "flex", flexDirection: "row", columnGap: '2rem', boxSizing: 'border-box' }}>
      <LeftPane>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: 'white',
          marginBottom: '2rem',
        }}>
          <Button color='primary' variant='contained' size='large' sx={{ flex: "1" }}>Featured</Button>
          <Button color='primary' size='large' sx={{ flex: "1" }}>Similar Jobs</Button>
          <Button color='primary' size='large' sx={{ flex: "1" }}>Most Recent</Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
          <Box sx={{ padding: '2rem', borderRadius: "8px", maxHeight: "300px", backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', alignItems: 'center', }}>
                <img src={data?.clientListing.organisationLogo} alt="Organisation Logo" width="50px" />
                <Typography variant='h5' fontWeight="600">{data?.clientListing.title}</Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bolder">{`${data?.clientListing.currency} ${data?.clientListing.salary}`}</Typography>
              </Box>
            </Box>
            <Typography variant='body1' fontWeight="300" style={{ margin: '1rem 0 0.5rem 0', height: '43px', overflow: 'hidden' }}>
              {data?.clientListing.description}
            </Typography>
            <Box sx={{ margin: '2rem 0', display: "flex", flexDirection: "row", flexWrap: "wrap", columnGap: "0.5rem", rowGap: "1rem" }}>
              {data?.clientListing.categories.slice(0, 3).map((c) => (
                <Chip sx={{ fontSize: "1rem", fontWeight: "400" }} key={c} label={LinkedInJobFunctionCodes[c]} />
              ))}
            </Box>
          </Box>
        </Box>
      </LeftPane>
      <RightPane sx={{ padding: '2rem', boxSizing: 'border-box', flex: '1.2', backgroundColor: 'white', borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '2rem', alignItems: 'center', }}>
            <img src={data?.clientListing.organisationLogo} alt="Organisation Logo" width="70px" />
            <Typography variant='h4' fontWeight="600">{data?.clientListing.title}</Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bolder">{`${data?.clientListing.currency} ${data?.clientListing.salary}`}</Typography>
            <Typography variant='h6' textAlign="right">{format(new Date(+(data?.clientListing.createdDate || 0)), "dd/MM/yyyy")}</Typography>
          </Box>
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

        <Box style={{ padding: '2rem 0 4rem 0' }}>
          <Typography variant='h5' fontWeight="600" style={{ padding: "2rem 0 1rem 0" }}>Skills Required</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", columnGap: "0.5rem", rowGap: "1rem" }}>
            {data?.clientListing.categories.map((c) => (
              <Chip sx={{ fontSize: "1.2rem", fontWeight: "400" }} key={c} label={LinkedInJobFunctionCodes[c]} />
            ))}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
          <a href={data?.clientListing.organisationWebsite} target="_blank" rel="noreferrer">{data?.clientListing.organisationWebsite}</a>
          { id && <DirectApply id={id} /> }
        </Box>
      </RightPane>
    </Box>
  )
}

export default Listing