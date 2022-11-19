import { gql, useMutation, useQuery } from '@apollo/client';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { alpha, Avatar, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { IUser, JobApplicationInput, ListingForClient } from 'common/models';
import theme from 'common/static/theme';
import { formatDistance } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
      skillsDescription
      workRemoteAllowed
      workplaceType
      employmentStatus
      experienceLevel
      expireAt
      listingType
      currency
      salary 
      alreadyApplied
      techSkills
    }
  }
`;

const CREATE_JOB_APPLICATION = gql`
  mutation CreateJobApplication($input: JobApplicationInput!) {
    createJobApplication(input: $input) {
      id
      createdDate
      user {
        name
        email
        profile {
          cv
        }
      }
    }
  }
`;

const LeftPane = styled('div')({
  boxSizing: 'border-box',
  flex: '0.5',
  borderRadius: '8px',
  height: '200px',
  '> div': {
    display: "flex",
    flexDirection: "column",
    marginBottom: '2rem',
    backgroundColor: theme.palette.background.default,
    padding: '2rem',
    borderRadius: '8px',
    rowGap: '2rem',
    color: 'white',
  }
});

const RightPane = styled('div')({
  padding: '2rem',
  boxSizing: 'border-box',
  flex: '1.2',
  borderRadius: '8px',
  backgroundColor: 'white',
});

const Chip = styled('div')({
  backgroundColor: alpha(theme.palette.secondary.main, 0.8),
  color: 'black',
  borderRadius: '0.4rem',
  padding: '1rem',
  textTransform: 'lowercase',
  fontWeight: 'bold',
})

const Listing: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { data } = useQuery<{ clientListing: ListingForClient }>(GET_LISTING, {
    variables: {
      id,
    },
    onError: (error) => {
      console.log(error.networkError);
    }
  });
  const [mutation] = useMutation<IUser, { input: JobApplicationInput }>(CREATE_JOB_APPLICATION, {
    refetchQueries: [GET_LISTING],
    onCompleted: () => {
      toast.success('Successfully applied to position');
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Something went wrong with applying for position');
    }
  });
  return (
    <Box sx={{ padding: '2rem', display: "flex", flexDirection: "row", columnGap: '2rem', boxSizing: 'border-box' }}>
      <LeftPane>
        <Box>
          <Typography variant='body1'>Tech Stack</Typography>
          <div style={{ display: "flex", flexDirection: "row", columnGap: '1rem', rowGap: '1rem', flexWrap: 'wrap' }}>
            {data?.clientListing.techSkills.map(ts => <Chip key={ts}>{ts}</Chip>)}
          </div>
        </Box>
        <Box>
          <div style={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
            <Avatar />
            <div>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.secondary.light
                }}>
                {data?.clientListing.createdByName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.secondary.light
                }}>
                Hiring Manager
              </Typography>
            </div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "5px", padding: '2rem' }}>
            <Typography variant='body1' sx={{ color: 'black' }}>
              {
                data?.clientListing.organisationDescription
              }
            </Typography>
          </div>
        </Box>
        <Box>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              color: theme.palette.secondary.light
            }}>
            Find Similar Jobs
          </Typography>
          <Button variant='contained' color='secondary'
            onClick={() => {
              nav('/search')
            }}>
            Find Similar Jobs
          </Button>
        </Box>
        <Box>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              color: theme.palette.secondary.light
            }}>
            Sounds like a match?
          </Typography>
          {id && (
            <Button
              disabled={data?.clientListing.alreadyApplied}
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              size="large"
              color='primary'
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.primary.main
                }
              }}
              onClick={() => mutation({
                variables: {
                  input: {
                    jobId: id
                  }
                }
              })}>
              {
                data?.clientListing.alreadyApplied ? "You have already applied to this position" : "Direct Apply"
              }
            </Button>
          )}
          <Button variant='outlined'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.info("Link copied to clipboard");
            }}>
            Share Job
            <InsertLinkIcon sx={{ marginLeft: '1rem' }} />
          </Button>
        </Box>
      </LeftPane>
      <RightPane sx={{ padding: '2rem', boxSizing: 'border-box', flex: '1.2', borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '2rem', alignItems: 'center', }}>
            <img src={data?.clientListing.organisationLogo} alt="Organisation Logo" width="70px" />
            <Typography variant='h4' fontWeight="600">{data?.clientListing.title}</Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bolder">{`${data?.clientListing.currency} ${data?.clientListing.salary.toLocaleString('en-gb', {
              style: 'currency',
              currency: 'GBP',
            })}`}</Typography>
            <Typography variant='h6' textAlign="right">Posted {formatDistance(new Date(), new Date(+(data?.clientListing.createdDate || 0)))} ago</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", columnGap: "1rem", margin: '2rem 0' }}>
          <Chip>{data?.clientListing.workplaceType}</Chip>
          <Chip>{data?.clientListing.employmentStatus}</Chip>
          <Chip>{data?.clientListing.experienceLevel}</Chip>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row"}}>
          <div>
            <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>Job Description</Typography>
            <Typography variant='body1' fontWeight="300">{data?.clientListing.description}</Typography>
          </div>
          <div>
            <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>Skills Description</Typography>
            <Typography variant='body1' fontWeight="300">{data?.clientListing.skillsDescription}</Typography>
          </div>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <a href={data?.clientListing.organisationWebsite} target="_blank" rel="noreferrer">{data?.clientListing.organisationWebsite}</a>
        </Box>
      </RightPane>
    </Box>
  )
}

export default Listing