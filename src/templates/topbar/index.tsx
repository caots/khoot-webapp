import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { AppBar, Badge, Box, IconButton, Toolbar, Tooltip } from '@material-ui/core';
import CustomDialog from 'src/components/customDialog';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Logo from 'src/components/logo';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'src/features/authen/authenSlice';
import { getToken } from 'src/utils/authService';
import { STORAGE_KEY } from 'src/config';

const DashboardTopbar = ({ onMobileNavOpen, ...rest }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [notifications] = useState([]);
  const [openDialog_ls, setOpenDialog_ls] = useState(false);
  const getUserDataMsg = useSelector((state: any) => state.authenSlice.fetchUserDataMsg);

  const clickHome = () => {
    if (!getToken(STORAGE_KEY.ACCESS_TOKEN) || !!getUserDataMsg) {
      router.push('/take-assessment');
    } else router.push('/assessment');
  };

  return (
    <AppBar elevation={5} {...rest} color="inherit">
      <Toolbar>
        <div onClick={() => clickHome()}>
          <Logo />
        </div>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ display: { xs: 'none', lg: 'block' } }} color="primary">
          <Badge badgeContent={notifications.length} color="primary" variant="dot">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <CustomDialog
          needOpen={openDialog_ls}
          title={`Đăng xuất`}
          content={`Bạn có chắc muốn đăng xuất không?`}
          button1={{ title: `Hủy`, action: () => setOpenDialog_ls(false) }}
          button2={{
            title: `Có`,
            action: () => {
              dispatch(logout());
              setOpenDialog_ls(false);
              router.push('/login');
            }
          }}
        />
        <Tooltip title="login">
          <IconButton
            color="primary"
            onClick={() => {
              dispatch(logout());
              router.push('/login');
            }}
          >
            <InputIcon />
          </IconButton>
        </Tooltip>

        <IconButton
          sx={{ display: { lg: 'none', xs: 'block' } }}
          color="primary"
          onClick={onMobileNavOpen}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

DashboardTopbar.propTypes = { onMobileNavOpen: PropTypes.func };

export default DashboardTopbar;
