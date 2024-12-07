import React from 'react';
import '../index.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale 
);

const LineChart = ({ chartData }) => {
    
    const labels = chartData.dates.length > 0 ? chartData.dates : ['No Data'];
    const quantities = chartData.quantities.length > 0 ? chartData.quantities : [0];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Quantity',
                data: quantities,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true, 
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month', 
                },
                title: {
                    display: true,
                    text: 'Date', 
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantity', 
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                mode: 'index', 
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default LineChart;
