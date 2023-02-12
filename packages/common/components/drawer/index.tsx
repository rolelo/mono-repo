import {
  Divider, Drawer, DrawerProps, Typography,
} from '@mui/material';
import React from 'react';
import theme from '../../static/theme';

type Props = {
  title: string;
  subtitle: string;
  extraInformation?: string | JSX.Element;
} & DrawerProps;

const RDrawer: React.FC<Props> = ({
  children, subtitle, title, extraInformation, style, ...rest
}) => (
  <Drawer
    {...rest}
    anchor="right"
    sx={{
      '& > .MuiPaper-root': {
        padding: '2rem',
        boxSizing: 'border-box',
        backgroundColor: theme.palette.secondary.light,
        ...style,
      },
    }}
  >
    <div>
      <Typography variant="h6" style={{ opacity: 0.6 }}>{subtitle}</Typography>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1" style={{ marginTop: '1rem' }}>{extraInformation}</Typography>
    </div>
    <Divider style={{ margin: '2rem 0' }} />
    {children}
  </Drawer>
);

export default RDrawer;
