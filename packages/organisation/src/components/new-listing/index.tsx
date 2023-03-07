import { gql, useMutation, useReactiveVar } from "@apollo/client";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion, AccordionDetails, AccordionSummary, Box,
  Button,
  Checkbox, CircularProgress, FormControl,
  FormControlLabel,
  InputLabel, List,
  ListItem,
  ListItemButton, MenuItem, Select, TextField, Typography
} from "@mui/material";
import Backdrop from 'common/components/backdrop';
import BackdropWithText from 'common/components/backdrop-with-text';
import CountriesDropdown from 'common/components/countries-dropdown';
import { useYupValidationResolver } from 'common/hooks';
import GoogleLogo from 'common/logo/google.png';
import IndeedLogo from 'common/logo/indeed.png';
import LinkedInLogo from 'common/logo/LI-In-Bug.png';
import {
  AdvertisingMedium,
  EmploymentStatus,
  ExperienceLevel,
  FoodAndDrink,
  JobOperationType,
  ListingCurrency,
  ListingInput,
  ListingType,
  TechSkills
} from 'common/models';
import theme from "common/static/theme";
import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Controller, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import useGetListings from "../../hooks/useGetListings";
import { userVar } from "../dashboard/layout";

const CREATE_LISTING = gql`
  mutation CreateListing($input: ListingInput!) {
    createListing(input: $input) {
      _id
      organisationName
      organisationDescription
      createdById
      createdByName
      createdDate
    }
  }
`;

const validationSchema = yup.object({
  // title: yup.string().max(200).required(),
  // advertisingMediums: yup.array().required(),
  // description: yup.string().min(100).max(125000).required(),
  // location: yup.string().required(),
  // workplaceType: yup.string().required(),
  // employmentStatus: yup.string().required(),
  // experienceLevel: yup.string().required(),
  // skillsDescription: yup.string().max(4000).required(),
});
const NewListing: React.FC = () => {
  const navigation = useNavigate();
  const user = useReactiveVar(userVar);
  const resolver = useYupValidationResolver(validationSchema);
  const listings = useGetListings();
  const [mutation, { loading }] = useMutation(CREATE_LISTING, {
    onCompleted: () => {
      toast.success("Your listing has been created, and will be active on the selected advertising platforms shortly");
      navigation('/listings');
    },
    onError: (error, data: any) => {
      toast.error(data?.errors?.length > 0 ? data?.errors[0].message : error?.message || "Something went wrong");
    }
  });
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: {
      isValid,
      isDirty,
      errors
    }, control } = useForm<ListingInput>({
      mode: 'all',
      defaultValues: {
        advertisingMediums: [],
      },
      resolver
    });

  const handleChange = (checked: boolean, advertisingMedium: AdvertisingMedium) => {
    const advertisingMediumsCloned = getValues().advertisingMediums;
    if (!checked) {
      const index = advertisingMedium.indexOf(advertisingMedium);
      if (index > -1) {
        advertisingMediumsCloned.splice(index, 1);
      }
      setValue('advertisingMediums', advertisingMediumsCloned);
    } else {
      advertisingMediumsCloned.push(advertisingMedium);
    }
    setValue('advertisingMediums', advertisingMediumsCloned);
  };

  const onSubmit = (data: ListingInput) => {
    const input: ListingInput = {
      advertisingMediums: data.advertisingMediums,
      description: data.description,
      employmentStatus: data.employmentStatus,
      experienceLevel: data.experienceLevel,
      expireAt: Date.now().toString(),
      listingType: data.listingType || ListingType.BASIC,
      jobPostingOperationType: JobOperationType.CREATE,
      location: data.location,
      skillsDescription: data.skillsDescription,
      title: data.title,
      workplaceType: data.workplaceType,
      workRemoteAllowed: Boolean(data.workRemoteAllowed),
      organisationId: data.organisationId,
      salary: Number((data.salary as unknown as string).replace(/[^0-9.-]+/g, "")),
      currency: ListingCurrency.GBP,
      bonus: +data.bonus,
      dentalHealthInsurance: `${data.dentalHealthInsurance}` === 'true',
      visionHealthInsurance: `${data.visionHealthInsurance}` === 'true',
      lifeInsurance: `${data.lifeInsurance}` === 'true',
      privateHealthInsurance: `${data.privateHealthInsurance}` === 'true',
      freeFoodAndDrink: data.freeFoodAndDrink,
      numberOfHolidays: +data.numberOfHolidays,
      rsus: +data.rsus,
      techSkills: data.techSkills,
      trainingAndDevelopment: `${data.trainingAndDevelopment}` === 'true',
      wellnessPackages: `${data.wellnessPackages}` === 'true',
      workFromHomePackage: `${data.workFromHomePackage}` === 'true',
      workingHoursPerWeek: +data.workingHoursPerWeek,
    }

    mutation({
      variables: {
        input
      }
    })
  }

  return (
    <Box sx={{
      padding: '2rem',
      boxSizing: 'border-box',
      '& .MuiAccordionSummary-content': {
        fontSize: '1.6rem',
        color: theme.palette.secondary.light
      },
      '& .MuiAccordionSummary-root': {
        backgroundColor: theme.palette.background.default
      },
      '& .Mui-expanded': {
        margin: '0 !important',
      },
      '& .MuiAccordion-root': {
        flex: 1,
        backgroundColor: 'white',
      }
    }}>
      <Box sx={{ flex: 1, marginBottom: '2rem' }}>
        <Accordion expanded={true}>
          <AccordionSummary>
            Clone Previous Jobs
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light, padding: 0 }}>
            {
              listings.loading
                ? <CircularProgress />
                :
                <List disablePadding>
                  {
                    listings.data?.listings.map(l => (
                      <ListItem
                        key={l._id}
                        disablePadding
                        style={{
                          color: theme.palette.background.default
                        }}>
                        <ListItemButton
                          sx={{ padding: '2rem', fontSize: '1.4rem' }}
                          onClick={() => reset(l)}
                        >
                          {l.title}
                        </ListItemButton>
                      </ListItem>
                    ))
                  }
                </List>
            }
          </AccordionDetails>
        </Accordion>
      </Box>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: "2rem"
        }}>
        <Box sx={{ flex: 3, display: "flex", flexDirection: "column", rowGap: "2rem" }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', rowGrap: '2rem', columnGap: '2rem' }}>
            <Accordion expanded={true}>
              <AccordionSummary sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: theme.palette.secondary.light,
                }
              }} expandIcon={<ExpandMoreIcon />}>
                1. Select Organisation
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light, paddingTop: '1.6rem' }}>
                <FormControl style={{ minWidth: 300 }} error={Boolean(errors.organisationId)}>
                  <InputLabel id="demo-simple-select-label">Select Your Organisation</InputLabel>
                  <Controller name="organisationId" control={control} render={({
                    field: { onChange, onBlur, ref }
                  }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Organisation"
                      variant="standard"
                      placeholder="Please select your organisation"
                      value={watch().organisationId || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      ref={ref}
                    >
                      {user?.organisations.map(({ _id, name }) => (<MenuItem key={_id} value={_id}>{name}</MenuItem>))}
                    </Select>
                  )} />
                </FormControl>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
              <AccordionSummary sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: theme.palette.secondary.light
                }
              }} expandIcon={<ExpandMoreIcon />}>
                2. Choose advertising medium
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light }}>
                <FormControlLabel
                  sx={{ padding: '0.8rem' }}
                  control={
                    <Checkbox
                      checked={watch().advertisingMediums.includes(AdvertisingMedium.LinkedIn)}
                      onChange={(_, checked) => handleChange(checked, AdvertisingMedium.LinkedIn)}
                    />
                  } label={(
                    <img src={LinkedInLogo} alt="LinkedIn" width="40px" />
                  )} />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={watch().advertisingMediums.includes(AdvertisingMedium.Indeed)}
                      onChange={(_, checked) => handleChange(checked, AdvertisingMedium.Indeed)}
                    />
                  } label={(
                    <img src={IndeedLogo} alt="Indeed" width="80px" />
                  )} />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={watch().advertisingMediums.includes(AdvertisingMedium.Google)}
                      onChange={(_, checked) => handleChange(checked, AdvertisingMedium.Google)}
                    />}
                  label={(
                    <img src={GoogleLogo} alt="Google" width="80px" />
                  )} />
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', rowGrap: '2rem', columnGap: '2rem' }}>
            <Accordion expanded={true}>
              <AccordionSummary sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: theme.palette.secondary.light
                }
              }} expandIcon={<ExpandMoreIcon />}>
                3. Description & Skills
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light }}>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
                  <TextField label="Job Title" variant="standard" fullWidth {...register('title')} InputLabelProps={{ shrink: true }} />
                  <TextField
                    id="outlined-multiline-static"
                    label="Job Description"
                    multiline
                    rows={4}
                    placeholder={'Provide the job description'}
                    {...register('description')}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="Provide the job skills description"
                    multiline
                    rows={4}
                    placeholder={'Provide the job skills description'}
                    {...register('skillsDescription')}
                    InputLabelProps={{ shrink: true }}
                  />
                 <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Exprience Level?</InputLabel>
                    <Controller control={control} name="experienceLevel" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Experience Level"
                        variant="standard"
                        placeholder="Experience Level"
                        value={watch().experienceLevel || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        {(Object.keys(ExperienceLevel) as Array<keyof typeof ExperienceLevel>).map((key) => (
                          <MenuItem value={key} key={key}>{ExperienceLevel[key]}</MenuItem>
                        ))}
                      </Select>)}
                    />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Skills required</InputLabel>
                    <Controller
                      control={control}
                      name='techSkills'
                      render={({
                        field: { onChange, onBlur, ref }
                      }) => (
                        <Select
                          multiple
                          multiline
                          value={watch().techSkills || []}
                          variant='standard'
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="techSkills"
                          onChange={onChange}
                          onBlur={onBlur}
                          ref={ref}
                        >
                          {(Object.keys(TechSkills) as Array<keyof typeof TechSkills>).map((key) => (
                            <MenuItem value={TechSkills[key]} key={TechSkills[key]}>{TechSkills[key]}</MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
              <AccordionSummary sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: theme.palette.secondary.light
                }
              }} expandIcon={<ExpandMoreIcon />}>
                4. Location & Workplace
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light }}>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
                  <CountriesDropdown register={() => register('location')} />
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Workplace type?</InputLabel>
                    <Controller control={control} name="workplaceType" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Workplace type"
                        variant="standard"
                        placeholder="Workplace type"
                        value={watch().workplaceType || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="On-site">On-Site</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                        <MenuItem value="Remote">Remote</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Employment Status?</InputLabel>
                    <Controller control={control} name="employmentStatus" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Employment Status"
                        variant="standard"
                        placeholder="Workplace type"
                        value={watch().employmentStatus || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        {(Object.keys(EmploymentStatus) as Array<keyof typeof EmploymentStatus>).map((key) => (
                          <MenuItem value={key} key={key}>{EmploymentStatus[key]}</MenuItem>
                        ))}
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Work remove allowed?</InputLabel>
                    <Controller control={control} name="workRemoteAllowed" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Work remote allowed"
                        variant="standard"
                        placeholder="Work remote allowed?"
                        value={watch().workRemoteAllowed || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value={`${true}`}>True</MenuItem>
                        <MenuItem value={`${false}`}>False</MenuItem>
                      </Select>)}
                    />
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', rowGrap: '2rem', columnGap: '2rem' }}>
            <Accordion expanded={true}>
              <AccordionSummary sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: theme.palette.secondary.light
                }
              }} expandIcon={<ExpandMoreIcon />}>
                5. Benefits
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light }}>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Health Insurance?</InputLabel>
                    <Controller control={control} name="privateHealthInsurance" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Health Insurance"
                        variant="standard"
                        placeholder="Health Insurance"
                        value={watch().privateHealthInsurance || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Dental Insurance?</InputLabel>
                    <Controller control={control} name="dentalHealthInsurance" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Dental Insurance"
                        variant="standard"
                        placeholder="Dental Insurance"
                        value={watch().dentalHealthInsurance || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Vision Insurance?</InputLabel>
                    <Controller control={control} name="visionHealthInsurance" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Vision Insurance"
                        variant="standard"
                        placeholder="Vision Insurance"
                        value={watch().visionHealthInsurance || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Life Insurance?</InputLabel>
                    <Controller control={control} name="lifeInsurance" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Life Insurance"
                        variant="standard"
                        placeholder="Life Insurance"
                        value={watch().lifeInsurance || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Wellness Packages (i.e. gym)?</InputLabel>
                    <Controller control={control} name="wellnessPackages" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Wellness Packages (i.e. gym)"
                        variant="standard"
                        placeholder="Wellness Packages (i.e. gym)"
                        value={watch().wellnessPackages || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Free Food and Drinks?</InputLabel>
                    <Controller control={control} name="freeFoodAndDrink" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        multiple
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Free food and drink"
                        variant="standard"
                        placeholder="Free food and drink?"
                        value={watch().freeFoodAndDrink || []}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        {(Object.keys(FoodAndDrink) as Array<keyof typeof FoodAndDrink>).map((key) => (
                          <MenuItem value={key} key={key}>{FoodAndDrink[key]}</MenuItem>
                        ))}
                      </Select>)}
                    />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Training & Development?</InputLabel>
                    <Controller control={control} name="trainingAndDevelopment" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Training & Development"
                        variant="standard"
                        placeholder="Training & Development"
                        value={watch().trainingAndDevelopment || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Work from home package?</InputLabel>
                    <Controller control={control} name="workFromHomePackage" render={({
                      field: { onChange, onBlur, ref }
                    }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Work from home package"
                        variant="standard"
                        placeholder="Work from home package"
                        value={watch().workFromHomePackage || ''}
                        onBlur={onBlur}
                        onChange={onChange}
                        ref={ref}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )} />
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}>
              <AccordionSummary sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: theme.palette.secondary.light
                }
              }} expandIcon={<ExpandMoreIcon />}>
                6. Compensation
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: theme.palette.secondary.light }}>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
                  <TextField
                    label="RSUS (up to) %"
                    type='number'
                    variant="standard"
                    fullWidth
                    {...register('rsus')}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Bonus (up to) %"
                    type='number'
                    variant="standard"
                    fullWidth
                    {...register('bonus')}
                    InputLabelProps={{ shrink: true }}
                  />
                  <CurrencyInput
                    placeholder="Annual Salary"
                    decimalsLimit={2}
                    prefix="£"
                    style={{
                      fontSize: "1.4rem",
                      padding: '1rem',
                      backgroundColor: theme.palette.grey[200],
                      border: 'none',
                    }}
                    {...register('salary')}
                  />
                  <TextField
                    label="Working hours per week"
                    type='number'
                    variant="standard"
                    fullWidth
                    {...register('workingHoursPerWeek')}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Number of holidays"
                    type='number'
                    variant="standard"
                    fullWidth
                    {...register('numberOfHolidays')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              onClick={() => {
                toast.info('Form has been reset')
                reset()
              }}
              variant='contained'
              size='large'
              sx={{ width: 'fit-content' }}
              color='info'
            >
              Reset Form
            </Button>
            <Button
              disabled={!isValid || !isDirty}
              type='submit'
              variant='contained'
              size='large'
              sx={{ width: 'fit-content' }}
              color='success'
            >
              Submit Job Listing
            </Button>
          </Box>
        </Box>
      </form>
      <Backdrop open={loading} />
      <BackdropWithText open={!user?.organisations?.length}>
        <div style={{ display: "flex", flexDirection: 'column', rowGap: '2rem' }}>
        <Typography variant='h5' textAlign={"center"}>
          You currently do not have any organisations,
          <br />
          please create one in order to be able to create a listing
        </Typography>
        <Button variant="contained" onClick={() => navigation('/organisation')}>Create Organisation</Button>
        </div >
      </BackdropWithText>
    </Box>
  )
}

export default NewListing
