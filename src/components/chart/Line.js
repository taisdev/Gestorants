import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [chartData, setChartData] = useState(null);
  const fetchData = async () => {
    const hoje = moment();
    const mesAtual = hoje.month() + 1;
    const diasDoMes = Array.from(
      { length: hoje.daysInMonth() },
      (_, i) => i + 1
    );
    const primeiroDia = hoje.clone().startOf("month");
    const ultimoDia = hoje.clone().endOf("month");
  
    const formattedFirstDay = primeiroDia.format("DD-MM-YYYY");
    const formattedLastDay = ultimoDia.format("DD-MM-YYYY");
    const url = `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/data/${formattedFirstDay}/${formattedLastDay}`;
  
    const response = await axios.get(url);
    const dadosDoMes = diasDoMes.map((dia) => {
      const pedidosDoDia = response.data.filter(
        (item) =>
          moment(item.data, "DD-MM-YYYY").date() === dia &&
          item.status !== "Cancelado"
      );
      const totalDoDia = pedidosDoDia.reduce(
        (acc, pedido) => acc + parseFloat(pedido.total),
        0
      );
      return totalDoDia || 0;
    });

    const labels = diasDoMes.map((dia) => dia.toString());
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const nomeDoMes = meses[mesAtual - 1];
    setChartData({
      labels,
      datasets: [
        {
          label: `Faturamento de ${nomeDoMes}`,
          data: dadosDoMes,
          backgroundColor: "rgba(97, 120, 222, 0.5)",
        },
      ],
    });
  };

  useEffect(() => {
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
          label: (context) => `Faturamento: R$ ${context.parsed.y.toFixed(2)}`,
          title: (context) => `Dia ${context[0].label}`,
        },
      },
    },
  };

  return (
    <>
      <h4>Faturamento mensal</h4>
      {chartData && <Line data={chartData} options={options}/>}
    </>
  );
};

export default LineChart;
