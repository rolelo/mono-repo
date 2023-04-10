import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { alpha, Avatar, Box, Button, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { EmploymentStatus, ExperienceLevel, IUser, JobApplicationInput, ListingForClient, WorkPlaceType } from 'common/models';
import theme from 'common/static/theme';
import { formatDistance } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { userVar } from '../dashboard/layout';

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
      rsus
      bonus
      techSkills
      numberOfHolidays
      privateHealthInsurance
      dentalHealthInsurance
      visionHealthInsurance
      lifeInsurance
      workingHoursPerWeek
      freeFoodAndDrink
      trainingAndDevelopment
      wellnessPackages
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

const DataView = styled('div')({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
})

const BlueDiv = styled('div')({
  display: "flex",
  flexDirection: "column",
  marginBottom: '2rem',
  backgroundColor: theme.palette.background.paper,
  padding: '2rem',
  borderRadius: '8px',
  rowGap: '2rem',
  color: 'black',
});

const LeftPane = styled('div')({
  boxSizing: 'border-box',
  flex: '0.5',
  borderRadius: '8px',
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

export const Chip = styled('div')({
  backgroundColor: alpha(theme.palette.secondary.main, 0.8),
  color: 'black',
  borderRadius: '0.4rem',
  padding: '1rem',
  textTransform: 'lowercase',
  fontWeight: 'bold',
})

export const Wrapper = styled('div')({
  padding: '2rem',
  display: "flex",
  flexDirection: "row-reverse",
  columnGap: '2rem',
  boxSizing: 'border-box',
  '@media(max-width: 450px)': {
    flexDirection: 'column-reverse',
  }
})

export const JobInformation = styled('div')({
  display: "flex",
  flexDirection: "row",
  columnGap: '2rem',
  marginBottom: '2rem',
  '@media(max-width: 450px)': {
    flexDirection: "column"
  }
})

export const Benefits = styled('div')({
  display: "flex",
  flexDirection: "row",
  columnGap: '1rem',
  marginTop: '2rem',
  '@media(max-width: 450px)': {
    flexDirection: "column",
  }
})

const Listing: React.FC = () => {
  const user = useReactiveVar(userVar);
  const { id } = useParams();
  const nav = useNavigate();
  const { data, loading } = useQuery<{ clientListing: ListingForClient }>(GET_LISTING, {
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

  if (loading) return <CircularProgress />;

  return (
    <Wrapper>
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
            Sounds like a match?
          </Typography>
          {id && (
            <Button
              disabled={data?.clientListing.alreadyApplied || !user?.profile}
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              size="large"
              color={'primary'}
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
                data?.clientListing.alreadyApplied
                  ? "You have already applied for this position"
                  : !user ? 'Sign In To Apply'
                    : !user?.profile ? 'Please create a profile'
                      : 'One click apply'
              }
            </Button>
          )}
          <div style={{ display: 'flex', flexDirection: "row", columnGap: '2rem' }}>
            <Button variant='outlined' style={{ flex: 1 }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.info("Link copied to clipboard");
              }}>
              Share Job
              <InsertLinkIcon sx={{ marginLeft: '1rem' }} />
            </Button>
            <Button variant='contained' color='secondary' style={{ flex: 1 }}
              onClick={() => {
                nav('/search');
              }}>
              Find Similar Jobs
            </Button>
          </div>
        </Box>
      </LeftPane>
      <div style={{ boxSizing: 'border-box', flex: '1.2', borderRadius: '8px' }}>
        <RightPane sx={{ padding: '2rem', boxSizing: 'border-box', flex: '1.2', borderRadius: '8px' }}>
          <Box sx={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
            '& > div > img': {
              width: '150px',
            },
            '@media(max-width: 450px)': {
              flexDirection: 'row',
              justifyContent: 'space-between',
              textAlign: 'right',
              alignItems: 'center',
              '> div > img': {
                width: '75px',
              },
            }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '2rem', alignItems: 'center', }}>
              <img src={data?.clientListing.organisationLogo} alt="Organisation Logo" />
            </Box>
            <Box>
              <Typography variant='h4' fontWeight="600">{data?.clientListing.title}</Typography>
              <Typography variant="h4" fontWeight="bolder">{data?.clientListing.salary.toLocaleString('en-gb', {
                style: 'currency',
                currency: 'GBP',
              })}
              </Typography>
              <Typography variant='h6'>Posted {formatDistance(new Date(), new Date(+(data?.clientListing.createdDate || 0)))} ago</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", columnGap: "1rem", margin: '2rem 0' }}>
            <Chip>{data?.clientListing.workplaceType && WorkPlaceType[data.clientListing.workplaceType]}</Chip>
            <Chip>{data?.clientListing.employmentStatus && EmploymentStatus[data.clientListing.employmentStatus as keyof typeof EmploymentStatus]}</Chip>
            <Chip>{data?.clientListing.experienceLevel && ExperienceLevel[data.clientListing.experienceLevel as keyof typeof ExperienceLevel ]}</Chip>
          </Box>
          <JobInformation>
            <div style={{ flex: 1 }}>
              <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>Job Description</Typography>
              <Typography variant='body1' fontWeight="300">{data?.clientListing.description}</Typography>
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant='h5' fontWeight="600" style={{ margin: '2rem 0 1rem 0' }}>Skills Description</Typography>
              <Typography variant='body1' fontWeight="300">{data?.clientListing.skillsDescription}</Typography>
            </div>
          </JobInformation>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <a href={data?.clientListing.organisationWebsite} target="_blank" rel="noreferrer">{data?.clientListing.organisationWebsite}</a>
          </Box>
        </RightPane>
        <Benefits>
          <BlueDiv style={{ flex: 1 }}>
            <Typography variant='body1' fontWeight='bold'>Compensation & Holidays</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
              <DataView>
                <Typography variant='body2'>Salary</Typography>
                <Typography variant='body2' fontWeight='bold'>
                  {data?.clientListing.salary.toLocaleString('en-gb', {
                    style: 'currency',
                    currency: 'GBP',
                  })}
                </Typography>
              </DataView>
              <DataView>
                <Typography variant='body2'>RSUS (% of Salary)</Typography>
                <Typography variant='body2' fontWeight='bold'>
                  {data?.clientListing.rsus}%
                </Typography>
              </DataView>
              <DataView>
                <Typography variant='body2'>Bonus (% of Salary)</Typography>
                <Typography variant='body2' fontWeight='bold'>
                  {data?.clientListing.bonus}%
                </Typography>
              </DataView>
              <DataView>
                <Typography variant='body2'>
                  Number of holidays (exc Bank Holidays):
                </Typography>
                <Typography variant='body2' fontWeight='bold'>
                  {data?.clientListing.numberOfHolidays}
                </Typography>
              </DataView>
              <DataView>
                <Typography variant='body2'>
                  Weekly Working Hours:
                </Typography>
                <Typography variant='body2' fontWeight='bold'>
                  {data?.clientListing.workingHoursPerWeek}
                </Typography>
              </DataView>
            </div>
          </BlueDiv>
          <BlueDiv style={{ flex: 1 }}>
            <Typography variant='body1' fontWeight='bold'>Health Insurance</Typography>
            <DataView>
              <Typography variant='body2'>
                Dental Health Insurance:
              </Typography>
              {
                data?.clientListing.dentalHealthInsurance
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
            <DataView>
              <Typography variant='body2'>
                Life Insurance:
              </Typography>
              {
                data?.clientListing.lifeInsurance
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
            <DataView>
              <Typography variant='body2'>
                Private Health Insurance:
              </Typography>
              {
                data?.clientListing.privateHealthInsurance
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
            <DataView>
              <Typography variant='body2'>
                Vision Insurance: {data?.clientListing.visionHealthInsurance}
              </Typography>
              {
                data?.clientListing.privateHealthInsurance
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
          </BlueDiv>
          <BlueDiv style={{ flex: 1 }}>
            <Typography variant='body1' fontWeight='bold'>Career Development & Benefits</Typography>
            <DataView>
              <Typography variant='body2'>
                Training & Development:
              </Typography>
              {
                data?.clientListing.trainingAndDevelopment
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
            <DataView>
              <Typography variant='body2'>
                Home Setup Package:
              </Typography>
              {
                data?.clientListing.workFromHomePackage
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
            <DataView>
              <Typography variant='body2'>
                Free Office Food & Drink:
              </Typography>
              {
                data?.clientListing.freeFoodAndDrink
                  ? <CheckCircleOutlinedIcon color='success' />
                  : <CancelOutlinedIcon color='error' />
              }
            </DataView>
          </BlueDiv>
        </Benefits>
      </div>
    </Wrapper >
  )
}

export default Listing