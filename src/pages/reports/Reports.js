import React, { useState } from "react";

import PropTypes from "prop-types";
import { HiCurrencyDollar, HiShoppingBag, HiUsers } from "react-icons/hi2";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import Chart from "../../components/chart/Chart";
import LineChart from "../../components/chart/Line";
import Overview from "./Overview";
import Sales from "./Sales";
import moment from "moment";
import axios from "axios";
import { useEffect } from "react";
import Loading from "../../components/loader/Loading";
import { format } from "date-fns";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Reports = () => {
  const [clientes, setClientes] = useState(0);
  const [value, setValue] = useState(0);
  const [orders, setOrders] = useState(0);
  const [total, setTotal] = useState("R$ 0.00");
  const [isLoading, setIsLoading] = useState(false);

  const getData = () => {
    setIsLoading(true);
    const currentDate = new Date();
    const formattedDate = moment(currentDate).format("DD-MM-YYYY");
    const url = `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/data/${formattedDate}/${formattedDate}`;
    const url2 =
      "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/cliente";

    try {
      axios.get(url).then((response) => {
        const data = response.data;

        if (data.length > 0) {
          setOrders(data.length);

          let total = 0;
          data.forEach((item) => {
            if (item.status !== "Cancelado") {
              total += parseFloat(item.total);
            }
          });

          const formattedTotal = `R$ ${total.toFixed(2)}`;
          setTotal(formattedTotal);
          setIsLoading(false);
        }
      });

      axios.get(url2).then((response) => {
        const clientes = response.data;
        const currentDate = new Date();

        const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");

        let count = 0;

        clientes.forEach((cliente) => {
          const createdAt = cliente.createdAt;

          if (createdAt === formattedCurrentDate) {
            count++;
          }
        });

        setClientes(count);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {isLoading && <Loading />}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Visão geral" {...a11yProps(0)} />
            <Tab label="Vendas" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h4>Resumo do dia</h4>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Overview
                title="Novos clientes"
                value={clientes}
                color="#10B981"
                icon={<HiUsers />}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Overview
                title="Total de pedidos"
                value={orders}
                color="#f44336"
                icon={<HiShoppingBag />}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Overview
                title="Faturamento"
                value={total}
                color="rgb(97, 120, 222)"
                icon={<HiCurrencyDollar />}
              />
            </Grid>
            <Grid item xs={6}>
              <Chart />
            </Grid>
            <Grid item xs={6}>
              <LineChart />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Sales />
        </TabPanel>
      </Box>
    </>
  );
};

export default Reports;
