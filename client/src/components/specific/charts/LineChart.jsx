import { Line } from "react-chartjs-2";
import { useTheme } from "@mui/material";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { getSevenDays } from "../../../lib/features";

// Register necessary components for the Line chart
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Colors
);

const LineChart = ({ value = [] }) => {
  const theme = useTheme();

  // Define the chart data
  const data = {
    labels: getSevenDays(),
    datasets: [
      {
        label: "Active Users",
        data: [...value],
        borderColor: theme.palette.primary.main,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(75,192,192,0.4)"
            : "rgb(71, 71, 71)",
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: theme.palette.primary.main,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Define the chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          color: "gray",
        },
        ticks: {
          color: theme.palette.text.primary,
        },
      },
      y: {
        grid: {
          display: true,
          color: "gray",
        },
        ticks: {
          color: theme.palette.text.primary,
        },
      },
    },
    plugins: {
      legend: {
        title: {
          display: true,
          text: "Active Users",
          color: theme.palette.text.primary,
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.palette.background.default,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
      colors: {
        enabled: true,
      },
    },
  };

  return (
    <div
      style={{
        height: "400px",
        backgroundColor: theme.palette.background.paper, // Background color of the chart container
        padding: "20px",
        borderRadius: "8px", // Optional: Add border radius
        boxShadow: "0px 3px 6px rgba(0,0,0,0.1)", // Optional: Add box shadow for a better look
        marginTop: "20px",
      }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
