import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export default function RecentSearches({ searches }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Recent Searches</Typography>
      <List>
        {searches.map((search, index) => (
          <ListItem key={index}>
            <ListItemText primary={search.query} secondary={new Date(search.timestamp).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </>
  );
}