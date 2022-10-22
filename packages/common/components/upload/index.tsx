import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import * as React from 'react';

const UploadButton: React.FC<{ text: string }> = ({ text }) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <IconButton
      color="primary"
      aria-label="upload picture"
      component="label"
    >
      <input hidden accept="image/*" type="file" />
      <PhotoCamera sx={{
        width: '35px',
        height: '35px',
      }}
      />
    </IconButton>
    <Typography variant="body1">{text}</Typography>
  </Stack>
);

export default UploadButton;
