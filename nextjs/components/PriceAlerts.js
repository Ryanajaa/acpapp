import React from 'react';
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material';

export default function PriceAlerts({ alerts }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Price Alerts</Typography>
      <List>
        {alerts.map((alert, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={alert.productName} 
              secondary={`Target Price: $${alert.targetPrice}`} 
            />
            <Chip 
              label={alert.currentPrice < alert.targetPrice ? "Price Drop!" : "Watching"} 
              color={alert.currentPrice < alert.targetPrice ? "success" : "default"}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}