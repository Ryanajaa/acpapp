import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useRouter } from "next/router";

export default function DashboardPage() {
  const [latestLogId, setLatestLogId] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user:", parsedUser);
      setUser(parsedUser);
      logDashboardView(parsedUser.user_id);
    } else {
      router.push('/signin');
    }
  }, []);

  const logDashboardView = async (userId) => {
    try {
      const response = await axios.post("http://localhost:8000/api/log-dashboard-view", { user_id: userId });
      console.log("Dashboard view logged:", response.data);
    } catch (error) {
      console.error("Error logging dashboard view:", error.response ? error.response.data : error.message);
    }
  };
  

  useEffect(() => {
    const fetchLatestLogId = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/latest-log-id');
        setLatestLogId(response.data.latest_log_id);
      } catch (error) {
        console.error('Error fetching latest log ID:', error);
      }
    };

    fetchLatestLogId();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4} sx={{ padding: 5 }}>
      <Typography variant="h2" component="h1" sx={{ color: '#8FBFF8', fontSize: '4rem', fontWeight: 'bold', fontFamily: "Prompt"}}>
          Dashboard
        </Typography>
      <Box display="flex" justifyContent="center" sx={{ padding: 20 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            backgroundColor: '#8FBFF8', 
            padding: 3, 
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'white' }}>
            All time log count 
          </Typography>
          <Typography variant="h4" sx={{ color: 'white', mt: 1 }}>
            {latestLogId} times
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}