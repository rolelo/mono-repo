import { Backdrop, Box, Typography } from '@mui/material';
import React from 'react';
import theme from '../../static/theme';

type Props = {
  open: boolean,
  children: JSX.Element | JSX.Element[]
  setOpen?: (value: boolean) => void
}

const BackdropWithText: React.FC<Props> = ({ open, children, setOpen }) => {
  return (
    <div>
      <Backdrop style={{
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      }} open={open} onClick={() => setOpen && setOpen(false)}>
        <Box style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          { children }
        </Box>
      </Backdrop>
    </div>
  );
};

export default BackdropWithText;