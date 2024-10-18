import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, Grid } from "@mui/material";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useRouter } from "next/router";

export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user:", parsedUser);
      setUser(parsedUser);
      logProductView(parsedUser.user_id);
    } else {
      router.push('/signin');
    }
  }, []);

  const logProductView = async (userId) => {
    try {
      const response = await axios.post("http://localhost:8000/api/log-product-view", { user_id: userId });
      console.log("Product view logged:", response.data);
    } catch (error) {
      console.error("Error logging product view:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', padding: 5 }}>
      <Typography variant="h4" align='center' sx={{ color: '#053871', fontWeight: 'bold', fontFamily: "Prompt"}}>
        All Available Products
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} mt={4}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}