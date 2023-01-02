import {
  Avatar, Button, Menu, MenuItem, Tooltip
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../../logo/logo.png';
import { User } from '../../models';
import Amplify from '../../services/Amplify';
import theme from '../../static/theme';

type Props = {
  dropdownLinks?: JSX.Element[]
  appbarLinks?: JSX.Element[]
  avatarMenu: boolean
  user: User | null
}
const AvatarMenu: React.FC<Omit<Props, 'appbarLinks' | 'avatarMenu' | 'user'>> = ({ dropdownLinks }) => {
  const { mutate } = useMutation(Amplify.signOut, {
    onSuccess: () => {
      window.location.reload();
      toast.success('You have signed out successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error signing you out');
    },
  });
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);



  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Amir" src="a" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <div onClick={handleCloseUserMenu}>
          {dropdownLinks}
        </div>

        <MenuItem key="logout" onClick={() => mutate()}>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default function Navigation({ dropdownLinks, appbarLinks, avatarMenu, user }: Props): JSX.Element {
  const navigator = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, zIndex: 100 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.secondary.light,
          boxShadow: "none",
        }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => navigator('/')}
            sx={{ mr: 2 }}
          >
            <img src={Logo} alt="Rolelo" style={{ width: 25 }} />
          </IconButton>
          {appbarLinks}
          <Box sx={{ flexGrow: 1, justifyContent: 'flex-end', textAlign: 'right' }}>
            {
              !user && (
                <Button
                  variant='outlined'
                  component='a'
                  href='https://dev-auth.rolelo.com/auth/login'>
                  Sign In
                </Button>
              )
            }
            {
              avatarMenu && user &&
              <AvatarMenu dropdownLinks={dropdownLinks} />
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box >
  );
}
