import { gql, useMutation, useReactiveVar } from '@apollo/client';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import axios from 'axios';
import { Profile, ProfileInput, SignedUrl, TechSkills } from 'common/models';
import environmentVars from 'common/utils/env.variables';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import { userVar } from '../dashboard/layout';

var countries = require('i18n-iso-countries');
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
const countryList = countries.getNames("en", { select: "official" });

const GET_SIGNED_URL = gql`
  mutation CreateCVS3PreSignedUrl($content: String!) {
    createCVS3PreSignedUrl(content: $content) {
      uuid
      url
      fields
    }
  }
`

const CREATE_PROFILE = gql`
  mutation CreateProfile($input: ProfileInput!) {
    createProfile(input: $input) {
      salaryLookingFor
    }
  }
`;

const UserProfile: React.FC = () => {
  const user = useReactiveVar(userVar)
  const [fileUploaded, setFileUploaded] = useState<SignedUrl & { file: File } | null>(null);
  const [submitForm] = useMutation<Profile, { input: ProfileInput }>(CREATE_PROFILE, {
    onCompleted: () => {
      toast.success("Job Application submitted successfully, you can view the status of your request via the online portal.")
      handleReset();
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'There was an error creating your profile');
    }
  });

  console.log(user);
  const { handleSubmit, register, reset, watch, control, formState: { isValid, isDirty } } = useForm<ProfileInput>({
    mode: 'all',
    defaultValues: {
      ...(user?.profile ? { ...user?.profile } : {})
    }
  });
  const [mutation] = useMutation<{ createCVS3PreSignedUrl: SignedUrl }>(GET_SIGNED_URL);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"]
    },
    multiple: false,
    maxFiles: 1,
    onDrop: (file) => {
      handleUploadCV(file)
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const handleReset = () => {
    reset();
    setFileUploaded(null);
  }
  const handleUploadCV = async (f: File[]) => {
    console.log(f);
    if (f?.length) {
      try {
        const file = f[0];
        const result = await mutation({
          variables: {
            content: file.type,
          }
        });

        if (!result.data?.createCVS3PreSignedUrl) throw Error('Response empty');

        setFileUploaded({ ...result.data.createCVS3PreSignedUrl, file });
      } catch (e) {
        toast.error('Something went wrong uploading your file');
      }
    }
  };
  const uploadToS3 = async (): Promise<string | undefined> => {
    try {
      if (!fileUploaded) throw Error("No CV Selected");
      const { url, fields, file, uuid } = fileUploaded;
      const formData = new FormData();

      formData.append('Content-Type', file.type);
      const fieldsParsed = JSON.parse(fields);
      Object.entries(fieldsParsed).forEach(([k, v]: any) => {
        formData.append(k, v);
      });
      formData.append('file', file);
      await axios(url, {
        method: 'POST',
        data: formData,
      });

      return uuid;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong when trying to upload your file');
    }
  }
  const onSubmit: SubmitHandler<ProfileInput> = async (input): Promise<void> => {
    console.log(input);
    const uuid = await uploadToS3();
    submitForm({
      variables: {
        input: {
          ...input,
          cv: `${environmentVars.s3BucketUrl}/cv/${uuid}`,
          salaryLookingFor: +input.salaryLookingFor,
          yearsOfExperience: +input.yearsOfExperience,
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", rowGap: '2rem' }}>
      <Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Countries</InputLabel>
          <Controller
            control={control}
            name='countryOfResidence'
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="countryOfResidence"
                {...field}
                value={field.value || ""}
              >
                {Object.keys(countryList).map((key) => (
                  <MenuItem key={countryList[key]} value={countryList[key]}>{countryList[key]}</MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Right to Work In UK</InputLabel>
          <Controller
            control={control}
            name='rightToWorkInUK'
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="rightToWorkInUK"
                {...field}
                value={field.value || ""}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Right to Work In EU</InputLabel>
          <Controller
            control={control}
            name='rightToWorkInEU'
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="rightToWorkInEU"
                {...field}
                value={field.value || ""}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Right to Work In US</InputLabel>
          <Controller
            control={control}
            name='rightToWorkInUS'
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="rightToWorkInUS"
                {...field}
                value={field.value || ""}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Yeard of Experience</InputLabel>
          <Controller
            control={control}
            name='yearsOfExperience'
            render={({
              field
            }) => (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="yearsOfExperience"
                {...field}
                value={field.value || ""}
              >
                {
                  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((value) => (
                    <MenuItem value={value} key={value}>{value}</MenuItem>
                  ))
                }
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Tech Skills</InputLabel>
          <Controller
            control={control}
            name='techSkills'
            render={({
              field: { onChange, onBlur, value, name, ref }
            }) => (
              <Select
                multiple
                multiline
                value={watch().techSkills || []}
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
      <Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
        <FormControl fullWidth>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            {...register('salaryLookingFor')}
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Box>
      <section>
        <div {...getRootProps()}>
          <input
            {...getInputProps()}
          />
          <Box sx={{
            backgroundColor: "#FAFAFA",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "4rem",
            '&:hover': { cursor: 'pointer' }
          }}>
            <UploadFileIcon sx={{ fontSize: "4rem" }} />
            {
              fileUploaded?.file.name ?
                <Typography variant="h6" textAlign="center">{fileUploaded.file.name}</Typography>
                : <Typography variant="h6" textAlign="center">Drag & Drop or Click here to upload your latest CV</Typography>
            }
          </Box>
        </div>
      </section>
      <Button disabled={!isValid || !isDirty} type="submit" variant="contained" fullWidth>Create profile</Button>
    </form>
  )
}

export default UserProfile