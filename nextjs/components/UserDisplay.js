import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

const UserDisplay = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  if (!username) return null;

  return (
    <Typography variant="subtitle1" sx={{
      fontSize: "16px",
      fontWeight: 500,
      color: "#053871",
      padding: "0 10px",
    }}>
      Welcome, {username}
    </Typography>
  );
};

export default UserDisplay;