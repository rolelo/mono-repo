import { gql, useMutation, useReactiveVar } from '@apollo/client';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Alert, Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import axios from 'axios';
import { Profile, ProfileInput, SignedUrl, TechSkills } from 'common/models';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';
import ChangePassword from '../change-password';
import { GET_USER, userVar } from '../dashboard/layout';

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
  const user = useReactiveVar(userVar);
  const [viewOnly, setViewOnly] = useState<boolean>(Boolean(user?.profile));
  const [fileUploaded, setFileUploaded] = useState<SignedUrl & { file: File } | null>(null);
  const [mutation] = useMutation<{ createCVS3PreSignedUrl: SignedUrl }>(GET_SIGNED_URL);
  const [submitForm] = useMutation<Profile, { input: ProfileInput }>(CREATE_PROFILE, {
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Profile updated")
      setViewOnly(true);
      handleReset();
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'There was an error updating your profile');
    },
    refetchQueries: [GET_USER]
  });
  const { handleSubmit, register, reset, watch, control, formState: { isValid, isDirty } } = useForm<ProfileInput>({
    mode: 'all',
    defaultValues: {
      ...(user?.profile ? { ...user?.profile } : {})
    }
  });

  useEffect(() => {
    reset({ ...(user?.profile ? { ...user?.profile } : {}) });
    setViewOnly(true);
  }, [user, reset])

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
  const onSubmit: SubmitHandler<ProfileInput> = async ({
    countryOfResidence,
    rightToWorkInEU,
    rightToWorkInUK,
    rightToWorkInUS,
    cv,
    salaryLookingFor,
    techSkills,
    yearsOfExperience
  }): Promise<void> => {
    let uuid;
    if (!user?.profile?.cv || fileUploaded) {
      uuid = await uploadToS3();
    }
    submitForm({
      variables: {
        input: {
          countryOfResidence,
          rightToWorkInEU,
          rightToWorkInUK,
          rightToWorkInUS,
          techSkills,
          cv: uuid ? `${process.env.REACT_APP_S3_BUCKET_URL}/cv/${uuid}` : cv,
          salaryLookingFor: +salaryLookingFor,
          yearsOfExperience: +yearsOfExperience,
        }
      }
    });
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          rowGap: '2rem'
        }}>
        <Alert severity={!user?.profile ? 'error' : !viewOnly ? 'warning' : 'success'}>
          {!user?.profile ? 'You do not have a profile' : user?.profile && !viewOnly ? 'You are editing your profile' : 'You have completed your profile'}
        </Alert>
        <Box sx={{ display: "flex", flexDirection: "row", columnGap: "2rem" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country of Residence</InputLabel>
            <Controller
              control={control}
              name='countryOfResidence'
              render={({ field }) => (
                <Select
                  disabled={viewOnly}
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
                  disabled={viewOnly}
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
                  disabled={viewOnly}
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
                  disabled={viewOnly}
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
            <InputLabel id="demo-simple-select-label">Years of Experience</InputLabel>
            <Controller
              control={control}
              name='yearsOfExperience'
              render={({
                field
              }) => (
                <Select
                  labelId="demo-simple-select-label"
                  disabled={viewOnly}
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
                  disabled={viewOnly}
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
              disabled={viewOnly}
              startAdornment={<InputAdornment position="start">£</InputAdornment>}
              label="Amount"
            />
          </FormControl>
        </Box>
        {
          !viewOnly ? (
            <section>
              <div {...getRootProps()}>
                <input
                  {...getInputProps()}
                />
                <Box sx={{
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
          ) : (
            <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="info"
                component="a"
                href={user?.profile?.cv}
                target="_blank"
                referrerPolicy='no-referrer'>
                View Your Uploaded CV
              </Button>
              <Button onClick={() => setViewOnly(false)} variant="contained" color="secondary">Edit Your Profile</Button>
            </Box>
          )
        }
        {
          !viewOnly && (
            <Button disabled={(!isValid || !isDirty) && !user?.profile} type="submit" variant="contained" fullWidth>
              {user?.profile ? 'Update Profile' : 'Create profile'}
            </Button>
          )
        }
      </form>
      <ChangePassword />
    </div>
  )
}

export default UserProfile