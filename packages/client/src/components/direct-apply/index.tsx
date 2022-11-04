import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, TextField, Fade, Backdrop } from '@mui/material';
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IJobApplication } from 'common/models';
import { gql, useMutation } from '@apollo/client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SignedUrl } from 'common/models'

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

const DirectApply: React.FC<Props> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [mutation, { loading }] = useMutation<{ createCVS3PreSignedUrl: SignedUrl }>(GET_SIGNED_URL, {});
  const { handleSubmit, register } = useForm<IJobApplication>({
    mode: 'onBlur',
  });
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true)

  const onSubmit: SubmitHandler<IJobApplication> = (data) => {
    console.log(data);
  }

  const handleUploadCV = async (e: any) => {
    if (e.target.files?.length) {
      try {
        console.log("in here");
        const file = e.target.files[0];
        const result = await mutation({
          variables: {
            content: file.type,
          }
        });

        if (!result.data?.createCVS3PreSignedUrl) throw Error('Response empty');

        const { url, fields } = result.data.createCVS3PreSignedUrl;
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
      } catch (e) {
        console.log(e);
        toast.error('Something went wrong uploading your file');
      }
    }
  };

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
            <Button variant="contained" onClick={handleUploadCV} component="label" startIcon={<UploadFileIcon />} size="large">
              Upload your CV
              <input hidden accept="application/pdf" multiple type="file" />
            </Button>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", rowGap: '2rem' }}>
              <TextField label="Name" variant="filled" fullWidth {...register('name')} />
              <TextField label="Email" variant="filled" fullWidth {...register('email')} />
              <Button variant="contained" color='success' size="large">
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