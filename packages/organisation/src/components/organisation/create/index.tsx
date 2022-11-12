import styled from '@emotion/styled';
import { TextField, Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import ImageUpload from 'common/components/upload';
import { CreateOrganisation, Organisation } from 'common/models';
import { gql, useMutation } from '@apollo/client';

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

const CREATE_ORGANISATION = gql`
  mutation CreateOrganisation($input: CreateOrganisationInput!) {
    createOrganisation(input: $input) {
      _id
    }
  }
`;

type Props = {
  callback?: Function
}
const Create: React.FC<Props> = ({ callback }) => {
  const { handleSubmit, register, formState: { isValid }, setValue, watch, reset } = useForm<CreateOrganisation>({
    mode: 'onBlur',
  });
  const [mutation, { loading }] = useMutation<{ createOrganisation: Organisation }>(CREATE_ORGANISATION, {
    onCompleted: (data) => {
      reset();
      if (callback) callback();
    }
  });

  const onSubmit = (data: CreateOrganisation) => {
    mutation({
      variables: {
        input: {
          email: data.email,
          name: data.name,
          website: data.website,
          companyLogo: data.companyLogo,
          companyDescription: data.companyDescription
        },
      }
    })
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', rowGap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', rowGap: '1rem', columnGap: '2rem' }}>
          <ImageUpload
            display={true}
            imageUrl={watch().companyLogo}
            submitImage={(imageUrl: string) => {
              console.log(imageUrl);
              setValue('companyLogo', imageUrl)
            }}
            clearImage={() => setValue('companyLogo', '')}
          />
          <div className="wrapper" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <TextField label="Name" variant="outlined" fullWidth {...register('name')} />
            <TextField label="Website" variant="outlined" fullWidth type="url" {...register('website')} />
          </div>
        </div>
        <div className="wrapper">
          <TextField label="Email" variant="outlined" type='email' fullWidth {...register('email')} />
        </div>
        <div className="wrapper">
          <TextField label="Company Description" variant="outlined" multiline minRows={4} fullWidth {...register('companyDescription')} />
        </div>
        <Button
          type="submit"
          variant='contained'
          size='large'
          color='success'
          sx={{ display: 'block', marginLeft: 'auto' }}
          disabled={
            loading || !isValid
          }>
          Create Organisation
        </Button>
      </form>
    </Container>
  );
};

export default Create;
