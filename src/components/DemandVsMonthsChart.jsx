import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const DemandVsMonthsChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.month),
    datasets: [
      {
        label: 'Demand',
        data: data.map((entry) => entry.demand),
        fill: "red",
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'white', 
        pointBorderColor: 'white',
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          color: 'white',
        },
        ticks: {
          color: 'white', 
        },
        
      },
      y: {
        title: {
          display: true,
          text: 'Demand',
          color: 'white',
        },
        ticks: {
          color: 'white', 
        },
      },
    },
  };
  const chartStyles = {
   
    width: '100%', 
    height:"100%"
  };

  return (
    <div className='w-screen h-96 flex_center'>
      <Line data={chartData} options={chartOptions} style={chartStyles} />
    </div>
  );
};

export default DemandVsMonthsChart;
