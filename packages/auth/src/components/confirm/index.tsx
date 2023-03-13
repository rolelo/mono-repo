import { Button, Fade, Typography } from '@mui/material';
import React from 'react';
import ReactCodeInput from 'react-code-input';
import { useNavigate } from 'react-router-dom';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import Amplify from 'common/services/Amplify';
import { CustomForm } from '../signup';

type TConfirm = {
  email: string;
  code: string;
}

const Confirm: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<ISignUpResult>();
  const mutation = useMutation(({ email, code }: TConfirm) => Amplify.confirmSignUp(email, code), {
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    },
  });
  const resendMutation = useMutation(({ email }: Omit<TConfirm, 'code'>) => Amplify.resendConfirmationCode(email), {
    onSuccess: () => {
      toast.info(`Sent a new code to ${user?.codeDeliveryDetails.Destination}`);
    },
  });

  React.useEffect(() => {
    console.log(Amplify.userSubject.getValue())
    if (!Amplify.userSubject.getValue()) {
      navigate('/');
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setUser(Amplify.userSubject.getValue()!);
    }
  }, [navigate]);
  return (
    <Fade in timeout={600}>
      <CustomForm>
        <div>
          <h1>Please check your email</h1>
          <h2 style={{ fontWeight: '400' }}>
            We have sent a code to
            {' '}
            {user?.codeDeliveryDetails.Destination}
            {' '}
          </h2>
        </div>
        <ReactCodeInput
          name="code"
          inputMode="email"
          type="text"
          fields={6}
          onChange={(data) => {
            if (data.length === 6) {
              const email = user?.user.getUsername();
              if (!email) throw Error('No Email found');
              mutation.mutate({
                email,
                code: data,
              });
            }
          }}
        />
        <div className="contentHolder">
          <Typography variant="body1">Did not receive a code?</Typography>
          <Button
            color="secondary"
            variant="text"
            onClick={() => {
              const email = user?.user.getUsername();
              if (!email) throw Error('No Email found');
              resendMutation.mutate({ email });
            }}
          >
            Click to resend

          </Button>
        </div>
      </CustomForm>
    </Fade>
  );
};
export default Confirm;
