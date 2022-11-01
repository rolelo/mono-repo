import { gql, useReactiveVar, useMutation } from "@apollo/client";
import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, TextField, Typography } from "@mui/material";
import Select from '@mui/material/Select';
import CountriesDropdown from 'common/components/countries-dropdown';
import { useYupValidationResolver } from 'common/hooks';
import GoogleLogo from 'common/logo/google.png';
import IndeedLogo from 'common/logo/indeed.png';
import LinkedInLogo from 'common/logo/LI-In-Bug.png';
import Backdrop from 'common/components/backdrop';
import { AdvertisingMedium, EmploymentStatus, ExperienceLevel, JobOperationType, LinkedInJobFunctionCodes, ListingCurrency, ListingInput, ListingType } from 'common/models';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as yup from 'yup';
import { userVar } from "../dashboard/layout";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
  title: yup.string().max(200).required(),
  advertisingMediums: yup.array().required(),
  description: yup.string().min(100).max(125000).required(),
  location: yup.string().required(),
  categories: yup.array().required(),
  workplaceType: yup.string().required(),
  employmentStatus: yup.string().required(),
  experienceLevel: yup.string().required(),
  skillsDescription: yup.string().max(4000).required(),
  salary: yup.number().required(),
});
const NewListing: React.FC = () => {
  const navigation = useNavigate();
  const user = useReactiveVar(userVar);
  const resolver = useYupValidationResolver(validationSchema);
  const [mutation, { loading }] = useMutation(CREATE_LISTING, {
    onCompleted: () => {
      toast.success("Your listing has been created, and will be active on the selected advertising platforms shortly");
      navigation('/listings');
    },
    onError: (error, data: any) => {
      toast.error(data?.errors?.length > 0 ? data?.errors[0].message : error?.message || "Something went wrong");
    }
  })
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
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
      categories: data.categories,
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
      currency: data.currency,
      salary: +data.salary,
    }

    mutation({
      variables: {
        input
      }
    })
  }

  return (
    <Box sx={{ padding: '2rem', boxSizing: 'border-box', width: '1000px' }}>
      <Typography variant='h3'>New Job Listing</Typography>
      <Box style={{
        backgroundColor: "white",
        borderRadius: "5px",
        width: "100%",
        marginTop: '2rem',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
          <Box>
            <Typography variant="h4" style={{ display: "flex", alignItems: 'center', columnGap: '1rem', marginBottom: '2rem' }}>
              <Avatar sx={{ bgcolor: 'black' }}>1.</Avatar>
              Select Organisation
            </Typography>
            <FormControl style={{ minWidth: 300 }} error={Boolean(errors.organisationId)}>
              <InputLabel id="demo-simple-select-label">Select Your Organisation</InputLabel>
              <Controller name="organisationId" control={control} render={({
                field: { onChange, onBlur, value, name, ref }
              }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Organisation"
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
          </Box>
          <Box>
            <Typography variant="h4" style={{ display: "flex", alignItems: 'center', columnGap: '1rem', marginBottom: '2rem' }}>
              <Avatar sx={{ bgcolor: 'black' }}>2.</Avatar>
              Choose advertising medium
            </Typography>
            <FormControlLabel
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
          </Box>
          <Box sx={{ '& .MuiInputBase-root, .quill': { marginBottom: "2rem" } }}>
            <Typography variant="h4" style={{ display: "flex", alignItems: 'center', columnGap: '1rem', marginBottom: '2rem' }}>
              <Avatar sx={{ bgcolor: 'black' }}>3.</Avatar>
              Job Information
            </Typography>
            <TextField label="Job Title" variant="outlined" fullWidth {...register('title')} />
            <ReactQuill
              placeholder="Provide the job description"
              theme="snow"
              value={watch('description')}
              onChange={(val) => setValue('description', val)}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }]
                ]
              }}
            />
            <ReactQuill
              placeholder="Provide the job skills description"
              theme="snow"
              value={watch('skillsDescription')}
              onChange={(val) => setValue('skillsDescription', val)}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }]
                ]
              }}
            />
            <Box style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', alignItems: 'start' }}>
              <CountriesDropdown register={() => register('location')} />
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Select Your Job function categories</InputLabel>
                <Controller name="categories" control={control} render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    multiple
                    label="Job function category"
                    placeholder="Please select your job function categories"
                    value={watch().categories || []}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                  >
                    {
                      (Object.keys(LinkedInJobFunctionCodes) as Array<keyof typeof LinkedInJobFunctionCodes>)
                        .map(((key) => <MenuItem value={key} key={key}>{LinkedInJobFunctionCodes[key]}</MenuItem>))
                    }
                  </Select>
                )} />
              </FormControl>
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Workplace type?</InputLabel>
                <Controller control={control} name="workplaceType" render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Workplace type"
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
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', alignItems: 'start' }}>
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Employment Status?</InputLabel>
                <Controller control={control} name="employmentStatus" render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Employment Status"
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
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Exprience Level?</InputLabel>
                <Controller control={control} name="experienceLevel" render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Experience Level"
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
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Work remove allowed?</InputLabel>
                <Controller control={control} name="workRemoteAllowed" render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Work remote allowed"
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
            <Box style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', alignItems: 'start' }}>
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Currency?</InputLabel>
                <Controller control={control} name="currency" render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Currency"
                    placeholder="Currency"
                    value={watch().currency || ''}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                  >
                    {(Object.keys(ListingCurrency) as Array<keyof typeof ListingCurrency>).map((key) => (
                      <MenuItem value={key} key={key}>{key}</MenuItem>
                    ))}
                  </Select>
                )} />
              </FormControl>
              <TextField label="Salary" variant="outlined" fullWidth type={'number'} {...register('salary')} />
            </Box>
          </Box>
          <Button
            disabled={!isValid || !isDirty}
            type='submit'
            variant='contained'
            size='large'
            sx={{ width: 'fit-content', marginLeft: 'auto' }}
            color='success'
          >
            Submit Job Listing
          </Button>
        </form>
      </Box>
      <Backdrop open={loading} />
    </Box>
  )
}

export default NewListing
