import {
  Avatar,
  Box, Button, CircularProgress, styled
} from '@mui/material';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
//@ts-ignore
import EmptyProfileImage from 'common/logo/empty-profile-image.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import theme from '../../static/theme';

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

        submitImage(`${process.env.REACT_APP_S3_BUCKET_URL}/organisation-logos/${uuid}`);
      } catch (e) {
        console.log(e);
        toast.error('Something went wrong uploading your file');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center',
    }}
    >
      <Avatar
        sx={{
          width: '100px',
          height: '100px',
          marginRight: '2rem',
        }}
        color='primary'
        variant='rounded'
        src={imageUrl}>
        {
          loading
            ? <CircularProgress color='primary' />
            : <>A</>
        }
      </Avatar>
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
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
              <Button sx={{ width: '150px'}} variant="contained" color="secondary" style={{ marginRight: 8 }} component="span">
                Upload Image
              </Button>
              <Button sx={{ width: '150px' }} variant="contained" color="error" onClick={clearImage}>
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