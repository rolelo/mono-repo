import {
  Box, Button, CircularProgress, styled
} from '@mui/material';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
//@ts-ignore
import EmptyProfileImage from 'common/logo/empty-profile-image.png';
import environmentVars from 'common/utils/env.variables';
import axios from 'axios';
import { toast } from 'react-toastify';

const Input = styled('input')({
  display: 'none',
});

const GET_SIGNED_URL = gql`
  mutation CreateOrganisationS3PreSignedUrl($content: String!) {
    createOrganisationS3PreSignedUrl(content: $content) {
      uuid
      url
      fields
    }
  }
`
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
  const [mutation] = useMutation(GET_SIGNED_URL);
  const setImageValue = async (e: any) => {
    if (e.target.files?.length) {
      try {
        setLoading(true);
        const file = e.target.files[0];
        const result = await mutation({
          variables: {
            content: file.type,
          }
        });

        const { uuid, url, fields } = result.data?.createOrganisationS3PreSignedUrl;
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

        submitImage(environmentVars.s3BucketUrl + uuid);
      } catch(e) {
        console.log(e);
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
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid black',
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
            width: '110px',
            height: '110px',
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