import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import UploadButton from 'common/components/upload';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  row-gap: 1.6rem;
  .wrapper {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
`;

const Create: React.FC = () => {
  const { handleSubmit, register, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
  });
  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <UploadButton text="Upload an image of your company logo" />
      </div>
      <div className="wrapper">
        <TextField label="Name" variant="filled" fullWidth />
        <TextField label="Website" variant="filled" fullWidth />
      </div>
      <div className="wrapper">
        <TextField label="Name" variant="filled" fullWidth />
        <TextField label="Website" variant="filled" fullWidth />
      </div>
      <div className="wrapper">
        <TextField label="Name" variant="filled" fullWidth />
        <TextField label="Website" variant="filled" fullWidth />
      </div>
    </Container>
  );
};

export default Create;
