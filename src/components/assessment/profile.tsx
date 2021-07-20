import React from 'react';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { Avatar, Box, Typography } from '@material-ui/core';
import User from 'src/model/user';

const Profile = (dataRef: any) => {
  const classes = useStyles();
  const userData: User = dataRef.userData;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        py: 3
      }}
    >
      <Avatar
        sx={{
          height: 100,
          width: 100
        }}
      />
      <Typography color="textPrimary" gutterBottom variant="h6">
        {userData.full_name}
      </Typography>
      <p style={{ marginTop: 0 }}>
        {`Created at: ${moment(userData.created_at).format('LL')} `}
        {`(${moment(userData.created_at).fromNow()})`}
      </p>
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <p>Phone : {userData.phone}</p>
        <p>Email : {userData.email}</p>
        <p>Address : {userData.address}</p>
      </div>
    </Box>
  );
};

const useStyles = makeStyles({});

export default Profile;
