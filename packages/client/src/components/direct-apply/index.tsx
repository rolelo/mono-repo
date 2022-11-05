import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, TextField, Fade, Backdrop, Typography, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { JobApplicationInput } from 'common/models';
import { gql, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SignedUrl } from 'common/models'
import environmentVars from 'common/utils/env.variables';

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
  const [fileUploaded, setFileUploaded] = useState<SignedUrl & { file: any }>();
  const [mutation, { loading }] = useMutation<{ createCVS3PreSignedUrl: SignedUrl }>(GET_SIGNED_URL, {});
  const [submitForm] = useMutation<JobApplicationInput, { input: JobApplicationInput }>(CREATE_JOB_APPLICATION);
  const { handleSubmit, register, formState: { isValid, isDirty } } = useForm<JobApplicationInput>({
    mode: 'all',
    defaultValues: {
      jobId: id,
    }
  });

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true)

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

  const onSubmit: SubmitHandler<JobApplicationInput> = ({ email, jobId, name }): void => {
    const uuid = uploadToS3();
    submitForm({
      variables: {
        input: {
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
        onClose={handleClose}
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
                maxLength: 20,
                required: "Please enter your name",
              })} />
              <TextField label="Email" variant="filled" fullWidth {...register('email', {
                minLength: 4,
              })} />
              <div style={{ display: "flex", flexDirection: "row", columnGap: "2rem", alignItems: "center"}}>
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
              <Button startIcon={loading ?? <CircularProgress size='2rem' />} disabled={!isDirty || !isValid} variant="contained" color='success' size="large" type='submit'>
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