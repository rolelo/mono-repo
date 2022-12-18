import { Fade, Button, TextField } from '@mui/material';
import { useQueryString } from 'common/hooks';
import Amplify from 'common/services/Amplify';
import { useForm, SubmitHandler } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { useNavigate, Link } from 'react-router-dom';
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
  const { handleSubmit, setValue, register, watch, formState: { isDirty, isValid } } = useForm<PasswordResetCode>({
    mode: 'onBlur',
    defaultValues: {
      username: query.get('username') || '',
    }
  });

  const onSubmit: SubmitHandler<PasswordResetCode> = ({ code, username, new_password }) => {
    if (!username) navigate('/auth/login');
    Auth.forgotPasswordSubmit(username, code, new_password)
      .then(() => {
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
        <h1>Password Reset Code</h1>
        <OtpInput
          numInputs={6}
          value={watch('code')}
          onChange={(code: string) => setValue('code', code)}
          containerStyle={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
          inputStyle={{
            width: '40px',
            height: '40px',
            fontSize: '2rem',
          }}
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
          Reset Password
        </Button>
        <Link to="/auth/login">Back to login</Link>
      </CustomForm>
    </Fade>
  )
}

export default ResetPasswordCode