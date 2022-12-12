import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Amplify from 'common/services/Amplify';
import { Button, Divider, TextField, Typography } from '@mui/material';
import theme from 'common/static/theme';
import { toast } from 'react-toastify';

const { Auth } = Amplify;

type PasswordResetInput = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ChangePassword = () => {
  const [user, setUser] = useState()
  const { handleSubmit, register, reset, watch, formState: { isValid, isDirty, errors } } = useForm<PasswordResetInput>({
    mode: 'all',
  });

  console.log(user);
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(r => setUser(r));
  }, [setUser]);

  const onSubmit: SubmitHandler<PasswordResetInput> = async ({
    confirmNewPassword,
    currentPassword,
    newPassword,
  }): Promise<void> => {
    console.log("in here");
    await Auth.changePassword(user, currentPassword, newPassword)
      .then(() => {
        toast.success('Password successfully change');
        reset()
      })
      .catch(e => {
        toast.error(e.message)
      });
  }


  //@ts-ignore
  if (!user || user.attributes?.identities) return <></>

  return (
    <>
      <Divider
        textAlign='left'
        style={{ marginTop: "2rem" }}
      >
        <Typography variant='h5'>Change Password</Typography>
      </Divider>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          margin: "2rem 0",
          display: "flex",
          flexDirection: "column",
          rowGap: "1rem",
        }}
      >
        <TextField label="Current Password" variant="filled" type="password" fullWidth {
          ...register('currentPassword', {
            required: true,

          })
        } />
        <TextField label="New Password" variant="filled" type="password" fullWidth {
          ...register('newPassword', {
            required: true,
          })
        } />
        <TextField label="Confirm New Password" variant="filled" type="password" fullWidth {
          ...register('confirmNewPassword', {
            required: true,
            validate: (val: string) => {
              if (watch('newPassword') !== val) {
                return "Your passwords do not match"
              }
            }
          })
        } />
        <ul style={{
          listStyle: 'none',
          color: theme.palette.error.dark,
          fontSize: '1rem',
          fontWeight: 'bold',
          padding: 0,
        }}>
          {Object.keys(errors).map((e) => {
            const message = (errors as any)[e]?.message;
            return message ? <li>{message}</li> : <></>;
          })}
        </ul>
        <Button
          disabled={!isValid || !isDirty}
          style={{ width: 'fit-content', marginLeft: "auto" }}
          variant='contained'
          type="submit"
        >
          Submit Change Password
        </Button>
      </form>
    </>
  )
}

export default ChangePassword