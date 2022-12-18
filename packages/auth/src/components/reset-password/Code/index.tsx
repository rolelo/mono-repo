import { Fade, Button, TextField } from '@mui/material';
import { useQueryString } from 'common/hooks';
import Amplify from 'common/services/Amplify';
import { useForm, SubmitHandler } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { CustomForm } from '../../login';
import { toast } from 'react-toastify';

const { Auth } = Amplify;

type PasswordResetCode = {
  username: string;
  new_password: string;
  code: string;
}

const ResetPasswordCode = () => {
  const navigate = useNavigate()
  const query = useQueryString();
  const { handleSubmit, register, formState: { isDirty, isValid } } = useForm<PasswordResetCode>({
    mode: 'onBlur',
    defaultValues: {
      username: query.get('username') || '',
    }
  });

  const onSubmit: SubmitHandler<PasswordResetCode> = ({ code, username, new_password }) => {
    if (!username) navigate('/auth/login');
    Auth.forgotPasswordSubmit(username, code, new_password)
      .then((data) => {
        toast.success('Password changed');
        navigate('/auth/login');
      })
      .catch((err) => {
        toast.error(err.message)
      });
  }
  return (
    <Fade in timeout={600}>
      <CustomForm onSubmit={handleSubmit(onSubmit)}>
        <OtpInput
          numInputs={6}
          separator={<span>-</span>}
          {...register('code')}
        />
        <TextField label="New Password" variant="filled" type="password" fullWidth {
          ...register('new_password', {
            required: true,
          })
        } />
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

export default ResetPasswordCode