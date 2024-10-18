import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import Image from 'next/image';

const HomeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  backgroundColor: 'white',
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)({
  borderRadius: '20px',
  backgroundColor: '#8FBFF8',
  color: 'white',
  padding: '12px 24px',
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: '#7AAEE7',
  },
});

export default function Home() {
  const router = useRouter();

  return (
    <HomeContainer>
      <Box sx={{ width: 150, height: 150, marginBottom: 4, position: 'relative' }}>
        <Image
          src="/prodogo2.png"
          alt="Prodogo Logo"
          layout="fill"
          objectFit="contain"
        />
      </Box>
      <Typography variant="h2" component="h1" sx={{ color: '#8FBFF8', fontSize: '3rem', fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>
        Welcome to Product Comparison
      </Typography>
      <Typography variant="h5" sx={{ color: '#053871', marginBottom: 4, textAlign: 'center', maxWidth: '600px' }}>
        Compare products from multiple sources and find the best deals with ease.
      </Typography>
      <StyledButton onClick={() => router.push('/search')}>
        Start Comparing
      </StyledButton>
    </HomeContainer>
  );
}