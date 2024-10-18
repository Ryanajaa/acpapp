import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, Card, CardContent, CardMedia, Grid, Rating, Chip, Avatar, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useRouter } from "next/router";
import axios from "axios";

const PriceChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.contrastText,
  fontWeight: 'bold',
  fontSize: '1.1rem',
}));

const SourceAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  objectFit: 'contain',
  backgroundColor: 'transparent',
}));

export default function ResultPage() {
  const router = useRouter();
  const { query } = router.query;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          console.log("Fetching results for query:", query);
          const response = await axios.post("http://localhost:8000/api/search/", { 
            searchQuery: query,
            userId: JSON.parse(localStorage.getItem('user')).user_id
          });
          console.log("API response:", response.data);
          setProducts(response.data.results);
        } catch (error) {
          console.error("Error fetching search results", error);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [query]);

  const formatPrice = (price) => {
    const numericPrice = price.replace(/[^\d.]/g, '');
    return parseFloat(numericPrice).toFixed(2);
  };

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
    <Box sx={{ minHeight: '100vh', padding: 5 }}>
      <Typography variant="h4" align='center' sx={{ color: '#053871', fontWeight: 'bold', fontFamily: "Prompt"}}>
        Search Results : {query}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} mt={4}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    <PriceChip
                      icon={<AttachMoneyIcon />}
                      label={formatPrice(product.price)}
                    />
                    <SourceAvatar src={getSourceLogo(product.source)} alt={product.source} />
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating
                      name={`rating-${index}`}
                      value={parseFloat(product.rating)}
                      readOnly
                      precision={0.1}
                    />
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
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}