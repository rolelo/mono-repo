import { gql, useLazyQuery } from '@apollo/client';
import { Box, Button, TextField, Typography } from '@mui/material';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import theme from '../../static/theme';

const GET_LISTINGS = gql`
  query ClientListings($input: String!) {
    clientListings(textField: $input) {
      _id
      organisationName
      organisationDescription
      organisationWebsite
      organisationLogo
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
    }
  }
`;

const Search = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { isValid, isDirty } } = useForm({
    mode: 'all'
  });
  const [query] = useLazyQuery<{}>(GET_LISTINGS);

  const onSubmit: SubmitHandler<FieldValues> = ({ description }) => {
    navigate(`/search?searchfield=${description}`);
  }

  return (
    <Box style={{
      backgroundColor: theme.palette.background.default,
      height: '100vh',
      width: '100vw',
      position: 'absolute',
      top: '0',
      left: '0',
      overflow: 'hidden',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Box style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        rowGap: "4rem",
        borderRadius: "8px",
      }}>
        <Box>
          <Typography variant="h1" style={{
            color: theme.palette.grey[100],
            fontSize: "5rem",
            fontWeight: "bold",
          }}>Find your dream job with a simple search</Typography>
          <Typography variant="h2" style={{
            color: theme.palette.grey[400],
            fontSize: "3rem",
          }}>Apply to every single job with <i><b>literally</b></i> one click!</Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          columnGap: "4rem",
          borderRadius: "8px",
        }}>
          <TextField
            placeholder='Search for your desired job'
            color="primary"
            sx={{
              flex: 3,
              '& input': {
                fontSize: "3rem",
                color: theme.palette.grey[100],
                border: `2px solid ${theme.palette.grey[100]}`,
                borderRadius: '8px',
              }
            }}
            variant='outlined'
            {...register('description', {
              required: true,
            })}
          />
          <Button variant='contained' size='large'
            disabled={!isValid || !isDirty}
            type="submit"
            style={{
              fontSize: "1.5rem",
              height: "100%",
              flex: 0.5
            }}>
            Get Started
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default Search