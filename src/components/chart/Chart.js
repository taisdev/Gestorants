import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const data = Array(7).fill(0);

      const startOfWeek = moment().startOf('week');
      const endOfWeek = moment().endOf('week');

      try {
        const response = await axios.get('https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido');
        const vendas = response.data;

        vendas.forEach(venda => {
          const dataVenda = moment(venda.data, 'DD-MM-YYYY');
          
          if (dataVenda.isBetween(startOfWeek, endOfWeek, undefined, '[]') && venda.status !== 'Cancelado') {
            const diaSemana = dataVenda.day();
            data[diaSemana] += parseFloat(venda.total);
          }
        });

        setChartData({
          labels: daysOfWeek,
          datasets: [
            {
              label: 'Total de vendas',
              data: data,
              backgroundColor: 'rgba(97, 120, 222, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `R$ ${parseFloat(context.parsed.y).toFixed(2)}`,
        },
      },
    },
  };

  return (
    <>
      <h4>Vendas diárias</h4>
      {chartData && <Bar data={chartData} options={options} />}
    </>
  );
};

export default Chart;
