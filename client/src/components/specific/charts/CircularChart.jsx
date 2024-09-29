import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

const CircularChart = ({ value = [] }) => {
  const data = {
    labels: ["Single", "Group"],
    datasets: [
      {
        label: "Chats",
        data: value,
        backgroundColor: ["rgba(255, 206, 86, 1)", "rgba(153, 102, 255, 1)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "350px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CircularChart;
