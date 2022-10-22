/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import {
  Box, Button, CircularProgress, styled,
} from '@mui/material';
import React from 'react';
import EmptyProfileImage from 'common/logo/empty-profile-image.png';
import environmentVars from 'common/utils/env.variables';
import { toast } from 'react-toastify';

const Input = styled('input')({
  display: 'none',
});

interface Props {
  display?: boolean,
  imageUrl?: string,
  submitImage: (imageUrl: string) => void;
  clearImage: () => void;
}

const ImageUpload: React.FC<Props> = ({
  display, imageUrl, submitImage, clearImage,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const setImageValue = async (e: any) => {
    if (e.target.files?.length) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const response = await axios.post(environmentVars.lambdaUrl, {
          contentType: file.type,
        });
        const { url, uuid } = response.data;

        const formData = new FormData();
        formData.append('Content-Type', file.type);
        Object.entries(url.fields).forEach(([k, v]: any) => {
          formData.append(k, v);
        });
        formData.append('file', file);
        await axios(url.url, {
          method: 'POST',
          data: formData,
        });

        submitImage(environmentVars.s3BucketUrl + uuid);
      } catch {
        toast.error('Something went wrong uploading your file');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-evenly',
    }}
    >
      <Box
        color="primary"
        aria-label="upload picture"
        component="span"
        sx={{
          width: '110px',
          height: '110px',
          backgroundColor: '#dbdbdb52',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={imageUrl || EmptyProfileImage}
          alt="Profile"
          style={{
            width: '130px',
            height: '130px',
            position: 'absolute',
            borderRadius: '50%',
          }}
        />
        {
          loading
          && <CircularProgress />
        }
      </Box>
      {
        display && (
          <label
            htmlFor="icon-button-file"
            style={{
              display: 'inline-block',
            }}
          >
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={setImageValue}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Button variant="contained" color="secondary" style={{ marginRight: 8 }} component="span">
                Upload Image
              </Button>
              <Button variant="contained" color="error" onClick={clearImage}>
                Remove Image
              </Button>
            </div>
          </label>

        )
      }
    </div>
  );
};

export default ImageUpload;