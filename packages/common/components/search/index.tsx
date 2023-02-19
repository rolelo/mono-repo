import styled from '@emotion/styled';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import theme from '../../static/theme';

const Form = styled('form')({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  columnGap: "4rem",
  borderRadius: "8px",
  '@media(max-width: 450px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: '2rem',
    '> div, > button': {
      width: '100%',
    }
  }
})

type Props = {
  home?: boolean
};

const Search: React.FC<Props> = ({ home }) => {
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { isValid, isDirty } } = useForm({
    mode: 'all'
  });

  const onSubmit: SubmitHandler<FieldValues> = ({ description }) => {
    if (home && window.top) {
      window.top.location = `https://${process.env.REACT_APP_CLIENT_URL}/search?searchfield=${description}`;
    } else {
      navigate(`/search?searchfield=${description}`);
    }
  }


  return (
    <Box style={{
      backgroundColor: theme.palette.background.default,
      ...(home ? {} : {
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: '0',
        left: '0',
        overflow: 'hidden',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })
    }}>
      <Box style={{
        position: "relative",
        padding: '2rem',
        display: "flex",
        flexDirection: "column",
        rowGap: "4rem",
        borderRadius: "8px",
      }}>
        <Box>
          <Typography variant="h1" style={{
            color: theme.palette.grey[100],
            fontSize: "5rem",
            fontWeight: "bold",
          }}>Find your dream job with a simple search</Typography>
          <Typography variant="h2" style={{
            color: theme.palette.grey[400],
            fontSize: "3rem",
          }}>Apply to every single job with <i><b>literally</b></i> one click!</Typography>
        </Box>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            placeholder='Search for your desired job'
            color="primary"
            sx={{
              flex: 2,
              '& input': {
                fontSize: "3rem",
                color: theme.palette.grey[100],
                border: `2px solid ${theme.palette.grey[100]}`,
                borderRadius: '8px',
              }
            }}
            variant='outlined'
            {...register('description', {
              required: true,
            })}
          />
          <Button variant='contained' size='large'
            disabled={!isValid || !isDirty}
            type="submit"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              height: "83px",
              padding: "1.5rem",
              flex: 0.5,
              boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
            }}>
            Get Started
          </Button>
        </Form>
      </Box>
    </Box>
  )
}

export default Search