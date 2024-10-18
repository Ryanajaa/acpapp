import React, { useState, useEffect } from "react";
import { Typography, Alert, Box, Snackbar,InputBase, IconButton } from "@mui/material";
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from "next/router";
import axios from "axios";
import Image from 'next/image';

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  backgroundColor: 'white',
  padding: theme.spacing(2),
  paddingTop: 'vh',
}));

const SearchBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 600,
  backgroundColor: '#E6F2FF',
  borderRadius: 30,
  padding: theme.spacing(0.5, 2),
  marginTop: theme.spacing(2),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: 16,
}));

const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
  padding: 10,
  borderRadius: '50%',
  backgroundColor: '#8FBFF8',
  color: 'white',
  '&:hover': {
    backgroundColor: '#7AAEE7',
  },
}));

const Logo = styled('img')({
  width: 40,
  height: 40,
  marginRight: 10,
});

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user:", parsedUser);
      setUser(parsedUser);
    } else {
      router.push('/signin');
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!user) {
      console.error("User not logged in");
      router.push('/signin');
      return;
    }

    if (!searchQuery.trim()) {
      setSnackbarMessage("Please fill in something to search");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      console.log("Sending search query:", searchQuery);
      const response = await axios.post("http://localhost:8000/api/search/", {
        searchQuery,
        userId: user.user_id
      });
      console.log("Response from backend:", response.data);
      
      if (response.data.message === "Search query received") {
        setSnackbarMessage("Data imported successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        router.push(`/result?query=${encodeURIComponent(searchQuery.trim())}`);
      }
    } catch (error) {
      console.error("Error sending search query", error);
      setSnackbarMessage("Error importing data");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <SearchContainer>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Box sx={{ width: 150, height: 150, marginBottom: 2, position: 'relative' }}>
          <Image
            src="/prodogo2.png"
            alt="Prodogo Logo"
            layout="fill"
            objectFit="contain"
          />
        </Box>
        <Typography variant="h2" component="h1" sx={{ color: '#8FBFF8', fontSize: '4rem', fontWeight: 'bold', fontFamily: "Prompt"}}>
          Prodogo
        </Typography>
      </Box>
      <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 600 }}>
        <SearchBar>
          <StyledInputBase
            placeholder="What are you looking for..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
          <SearchIconWrapper type="submit" aria-label="search">
            <SearchIcon />
          </SearchIconWrapper>
        </SearchBar>
      </form>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SearchContainer>
  );
}