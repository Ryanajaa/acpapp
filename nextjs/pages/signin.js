import React, { useState } from "react";
import { TextField, Button, Typography, Box, Snackbar, Alert, Link } from '@mui/material';
import { useRouter } from "next/router";
import { styled } from '@mui/system';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleNavigateToSignUp = () => {
    router.push("/register");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify({
      user_id: data.user_id,
      email: data.email,
      username: data.username 
      }));

      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Redirect to search page after successful login
      router.push('/search');
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const SignInContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '70vh',
    backgroundColor: 'white',
    padding: theme.spacing(2),
    paddingTop: '10vh',
  }));

  const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: '#d6e7f9',
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#83A9CB',
    },
  });
  
  const StyledButton = styled(Button)({
    borderRadius: '20px',
    backgroundColor: '#8FBFF8',
    color: 'white',
    padding: '12px',
    '&:hover': {
      backgroundColor: '#7AAEE7',
    },
  });

  return (
    <SignInContainer>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Box sx={{ width: 100, height: 100, marginBottom: 2, position: 'relative' }}>
          <Image
            src="/prodogo2.png"
            alt="Prodogo Logo"
            width={100}
            height={100}
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <Typography variant="h2" component="h1" sx={{ color: '#8FBFF8', fontSize: '3rem', fontWeight: 'bold', marginBottom: 4 }}>
          Sign In
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <StyledTextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
        <StyledTextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
        <StyledButton
          fullWidth
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Sign In
        </StyledButton>
      </Box>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
        Don't have an account?{" "}
          <Button color="primary" onClick={handleNavigateToSignUp}>
            Register
          </Button>
        </Typography>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SignInContainer>
  );
}