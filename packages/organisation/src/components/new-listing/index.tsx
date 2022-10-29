import { useReactiveVar } from "@apollo/client";
import { Avatar, Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import CountriesDropdown from 'common/components/countries-dropdown';
import GoogleLogo from 'common/logo/google.png';
import IndeedLogo from 'common/logo/indeed.png';
import LinkedInLogo from 'common/logo/LI-In-Bug.png';
import { AdvertisingMedium, EmploymentStatus, ExperienceLevel, LinkedInJobFunctionCodes, Listing } from 'common/models';
import React from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { userVar } from "../dashboard/layout";

const NewListing: React.FC = () => {
  const user = useReactiveVar(userVar);
  const { register, watch, setValue, getValues } = useForm<Listing>({
    defaultValues: {
      advertisingMediums: [],
    }
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
        <Box style={{ display: "flex", flexDirection: "column", rowGap: "2rem" }}>
          <Box>
            <Typography variant="h4" style={{ display: "flex", alignItems: 'center', columnGap: '1rem', marginBottom: '2rem' }}>
              <Avatar sx={{ bgcolor: 'black' }}>1.</Avatar>
              Select Organisation
            </Typography>
            <FormControl style={{ minWidth: 300 }}>
              <InputLabel id="demo-simple-select-label">Select Your Organisation</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={watch().organisationId}
                label="Organisation"
                onChange={(event: any) => setValue('organisationId', event.target?.value)}
                placeholder="Please select your organisation"
              >
                {user?.organisations.map(({ _id, name }) => (<MenuItem key={_id} value={_id}>{name}</MenuItem>))}
              </Select>
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
              <CountriesDropdown />
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Select Your Job function categories</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={watch().categories}
                  label="Job function category"
                  onChange={(event: any) => setValue('categories', event.target?.value)}
                  placeholder="Please select your job function categories"
                >
                  {
                    (Object.keys(LinkedInJobFunctionCodes) as Array<keyof typeof LinkedInJobFunctionCodes>)
                      .map(((key) => (<MenuItem value={key}>{LinkedInJobFunctionCodes[key]}</MenuItem>)))
                  }
                </Select>
              </FormControl>
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Workplace type?</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={watch().workplaceTypes}
                  label="Workplace type"
                  onChange={(event: any) => setValue('workplaceTypes', event.target?.value)}
                  placeholder="Workplace type"
                >
                  <MenuItem value="On-site">On-Site</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem', alignItems: 'start' }}>
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Employment Status?</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={watch().employmentStatus}
                  label="Employment Status"
                  onChange={(event: any) => setValue('employmentStatus', event.target?.value)}
                  placeholder="Workplace type"
                >
                  {(Object.keys(EmploymentStatus) as Array<keyof typeof EmploymentStatus>).map((key) => (
                    <MenuItem value={key} key={key}>{EmploymentStatus[key]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl style={{ minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Exprience Level?</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={watch().experienceLevel}
                  label="Experience Level"
                  onChange={(event: any) => setValue('experienceLevel', event.target?.value)}
                  placeholder="Workplace type"
                >
                  {(Object.keys(ExperienceLevel) as Array<keyof typeof ExperienceLevel>).map((key) => (
                    <MenuItem value={key} key={key}>{ExperienceLevel[key]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default NewListing
