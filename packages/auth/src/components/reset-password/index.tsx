import { Fade, TextField, Button } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate  } from 'react-router-dom';
import { CustomForm } from '../login';
import Amplify from 'common/services/Amplify';
import { toast } from 'react-toastify';

const { Auth } = Amplify;

type PasswordResetInput = {
  username: string;
}

const ResetPassword = () => {
  const navigate = useNavigate()
  const { handleSubmit, register, formState: { isDirty, isValid } } = useForm<PasswordResetInput>({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<PasswordResetInput> = ({ username }) => {
    Auth.forgotPassword(username)
      .then((data) => {
        toast.success('Email sent to ' + data.CodeDeliveryDetails.Destination);
        navigate('/auth/reset-password/code?username=' + username);
      })
      .catch((err) => {
        toast.error(err.message)
      });
  }
  return (
    <Fade in timeout={600}>
      <CustomForm onSubmit={handleSubmit(onSubmit)}>
        <h1>Password Reset</h1>
        <TextField label="Username" variant="filled" fullWidth {...register('username', {
          required: true,
        })} />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          size="large"
          disabled={!isValid || !isDirty}
        >
          Get Code
        </Button>
      </CustomForm>
    </Fade>
  )
}

export default ResetPassword