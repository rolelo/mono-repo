import styled from '@emotion/styled';
import { TextField, Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import ImageUpload from 'common/components/upload';
import { CreateOrganisation } from 'common/models';

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
  const { handleSubmit, register, formState: { errors, isValid }, setValue, getValues } = useForm<CreateOrganisation>({
    mode: 'onBlur',
  });

  const onSubmit = (data: CreateOrganisation) => {
    console.log(data);
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ImageUpload
            display={true}
            imageUrl={getValues().companyLogo}
            submitImage={(imageUrl: string) => setValue('companyLogo', imageUrl)}
            clearImage={() => console.log("Clear image")}
          />
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
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
};

export default Create;
