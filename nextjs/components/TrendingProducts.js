import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';

export default function TrendingProducts({ products }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Trending Products</Typography>
      <List>
        {products.map((product, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar alt={product.name} src={product.image} />
            </ListItemAvatar>
            <ListItemText primary={product.name} secondary={`Searches: ${product.searchCount}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
}