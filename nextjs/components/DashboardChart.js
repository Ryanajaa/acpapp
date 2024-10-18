import React from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardChart({ searchData }) {
  const data = {
    labels: searchData.labels,
    datasets: [
      {
        label: "Product Searches",
        data: searchData.data,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: 'Search Activity Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box height={400}>
      <Typography variant="h6" gutterBottom align="center">
        Search Statistics
      </Typography>
      <Line data={data} options={options} />
    </Box>
  );
}