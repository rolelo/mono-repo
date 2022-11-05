import { gql, useMutation } from '@apollo/client';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Backdrop, Box, Button, CircularProgress, Fade, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { JobApplicationInput, SignedUrl } from 'common/models';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';

type Props = {
  id: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const GET_SIGNED_URL = gql`
  mutation CreateCVS3PreSignedUrl($content: String!) {
    createCVS3PreSignedUrl(content: $content) {
      uuid
      url
      fields
    }
  }
`

const CREATE_JOB_APPLICATION = gql`
  mutation CreateJobApplication($input: JobApplicationInput!) {
    createJobApplication(input: $input) {
      name
    }
  }
`;

const DirectApply: React.FC<Props> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<SignedUrl & { file: any } | null>(null);
  const [submitForm] = useMutation<JobApplicationInput, { input: JobApplicationInput }>(CREATE_JOB_APPLICATION, {
    onCompleted: () => {
      toast.success("Job Application submitted successfully, you can view the status of your request via the online portal.")
      handleReset();
      handleClose();
    }
  });
  const { handleSubmit, register, reset, control, formState: { isValid, isDirty } } = useForm<JobApplicationInput>({
    mode: 'all',
    defaultValues: {
      phoneNumber: "",
      jobId: id,
    },
  });
  const [mutation, { loading }] = useMutation<{ createCVS3PreSignedUrl: SignedUrl }>(GET_SIGNED_URL);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleReset = () => {
    reset();
    setFileUploaded(null);
  }


  const handleUploadCV = async (e: any) => {
    if (e.target.files?.length) {
      try {
        const file = e.target.files[0];
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
    if (!fileUploaded) return;
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
  }

  const onSubmit: SubmitHandler<JobApplicationInput> = async ({ email, jobId, name, phoneNumber }): Promise<void> => {
    const uuid = await uploadToS3();

    submitForm({
      variables: {
        input: {
          phoneNumber,
          cvUrl: `${environmentVars.s3BucketUrl}/cv/${uuid}`,
          email,
          jobId,
          name,
        }
      }
    });
  }

  return (
    <>
      <Button variant="contained" component="label" startIcon={<UploadFileIcon />} size="large" onClick={handleOpen}>
        Direct Apply
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleReset();
          handleClose();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", rowGap: '2rem' }}>
              <TextField label="Name" variant="filled" fullWidth {...register('name', {
                minLength: 4,
                maxLength: 40,
                required: "Please enter your name",
              })} />
              <TextField label="Email" variant="filled" fullWidth {...register('email', {
                minLength: 4,
              })} />
              <Box sx={{ '& input': { backgroundColor: 'transparent', border: 0 } }}>
                <Controller control={control} name="phoneNumber" render={({ field: { onChange, value}}) => (
                  <PhoneInput
                    style={{ fontSize: '15px', padding: '1rem', border: 0, backgroundColor: "#9191911f" }}
                    defaultCountry='GB'
                    placeholder="Enter phone number"
                    value={value}
                    onChange={onChange}
                  />
                )}/>
              </Box>
              <div style={{ display: "flex", flexDirection: "row", columnGap: "2rem", alignItems: "center" }}>
                <Button variant="contained" component="label" startIcon={<UploadFileIcon />} size="large">
                  Upload your CV
                  <input
                    hidden
                    accept="application/pdf"
                    multiple
                    type="file"
                    {...register("cvUrl", {
                      onChange: handleUploadCV,
                      required: "Please upload your CV"
                    })}
                  />
                </Button>
                <Typography variant='body1'>{fileUploaded?.file?.name}</Typography>
              </div>
              <Button
                startIcon={loading ?? <CircularProgress size='2rem' />}
                disabled={!isDirty || !isValid}
                variant="contained"
                color='success'
                size="large"
                type='submit'>
                Apply For Position
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

export default DirectApply