import React, { useState } from "react";
import { TextField, Button, Typography, Box, Snackbar, Alert } from "@mui/material";
import { styled } from '@mui/system';
import { useRouter } from "next/router";
import Image from 'next/image';

const RegisterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '80vh',
  backgroundColor: 'white',
  padding: theme.spacing(2),
  paddingTop: '5vh',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    backgroundColor: '#E6F2FF',
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

export default function RegisterPage() {
  const router = useRouter();
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Navigate to Sign In page
  const handleNavigateToSignIn = () => {
    router.push("/signin");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password_hash: registerPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Redirect to Sign In page after successful registration
      router.push("/signin");
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Box sx={{ width: 100, height: 100, marginBottom: 2, position: 'relative' }}>
          <Image
            src="/prodogo2.png"
            alt="Prodogo Logo"
            layout="fill"
            objectFit="contain"
          />
        </Box>
        <Typography variant="h2" component="h1" sx={{ color: '#8FBFF8', fontSize: '3rem', fontWeight: 'bold'}}>
          Create an Account
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleRegisterSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <StyledTextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          required
        />
        <StyledTextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          required
        />
        <StyledTextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required
          helperText="Password must be at least 8 characters."
        />
        <StyledTextField
          fullWidth
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={registerConfirmPassword}
          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
          required
        />
        <StyledButton
          fullWidth
          type="submit"
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? "Registering..." : "Register"}
        </StyledButton>
      </Box>
      <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
        Already have an account?{" "}
        <Button color="primary" onClick={handleNavigateToSignIn}>
          Sign In
        </Button>
      </Typography>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </RegisterContainer>
  );
}