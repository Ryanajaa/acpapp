import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Avatar, List, ListItem, ListItemText } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const ProductCard = ({ product }) => {
  const getSourceLogo = (source) => {
    switch(source.toLowerCase()) {
      case 'amazon':
        return '/amazon-logo.png';
      case 'ebay':
        return '/ebay-logo.png';
      case 'walmart':
        return '/walmart-logo.png';
      default:
        return null;
    }
  };

  const formatSpecs = (specs) => {
    if (typeof specs === 'string') {
      try {
        specs = JSON.parse(specs);
      } catch (e) {
        return <Typography variant="body2">Specs: {specs}</Typography>;
      }
    }
    
    if (typeof specs !== 'object' || specs === null) {
      return <Typography variant="body2">Specs: Not available</Typography>;
    }

    return (
      <List dense>
        {Object.entries(specs).map(([key, value], index) => (
          <ListItem key={index} disableGutters>
            <ListItemText 
              primary={`${key}: ${value}`}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images || "/placeholder-image.jpg"}
        alt={product.title}
        sx={{ objectFit: 'contain', padding: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <AttachMoneyIcon sx={{ color: 'success.main' }} />
            <Typography variant="h6" color="success.main">
              {parseFloat(product.price.replace(/[^\d.]/g, '')).toFixed(2)}
            </Typography>
          </Box>
          <Avatar src={getSourceLogo(product.source)} alt={product.source} sx={{ width: 40, height: 40 }} />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Rating name={`rating-${product.id}`} value={parseFloat(product.rating)} readOnly precision={0.1} />
          <Typography variant="body2" color="text.secondary" ml={1}>
            ({product.rating})
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
          {formatSpecs(product.specs)}
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            <a href={product.url} target="_blank" rel="noopener noreferrer">View Product</a>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;