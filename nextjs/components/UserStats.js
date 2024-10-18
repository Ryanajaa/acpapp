import React from 'react';
import { Typography, Box, Grid } from '@mui/material';

export default function UserStats({ stats }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Your Activity</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box textAlign="center">
            <Typography variant="h4">{stats.totalSearches}</Typography>
            <Typography variant="body2">Total Searches</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="center">
            <Typography variant="h4">{stats.savedProducts}</Typography>
            <Typography variant="body2">Saved Products</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="center">
            <Typography variant="h4">{stats.priceAlerts}</Typography>
            <Typography variant="body2">Price Alerts</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="center">
            <Typography variant="h4">${stats.potentialSavings}</Typography>
            <Typography variant="body2">Potential Savings</Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}