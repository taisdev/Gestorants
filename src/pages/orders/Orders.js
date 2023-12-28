import React, { useState, useEffect } from "react";
import "./orders.scss";
import { db } from "../../firebase/config";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { renderIcon } from "./functions";
import axios from "axios";
import Details from "./Details";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { status } from "./status";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [id, setId] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("");

  const handleClick = async (id) => {
    setId(id);
    const response = await axios.get(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`
    );
    const data = response.data;
    setOrder(data);
    setEndereco(data.user.endereco);
  };

  function handleChange(event) {
    setStatusFiltro(event.target.value);
  }

  const listaFiltrada = statusFiltro
    ? orders.filter((pedido) => pedido.status === statusFiltro)
    : orders;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    const currentDay = moment().format("DD-MM-YYYY");
    const handleFetchData = onSnapshot(
      query(
        collection(db, "pedidos"),
        where("data", ">=", `${currentDay} 00:00:00`),
        where("data", "<=", `${currentDay} 23:59:59`),
        orderBy("data", "desc")
      ),
      (snapshot) => {
        var newOrders = null;
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }
          if (change.type === "modified") {
            newOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            handleClick(id);
          }
          if (change.type === "removed") {
            newOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setOrder(null);
          }
        });
        setOrders(newOrders);
      }
    );
    return handleFetchData;
  }, [id, order, endereco]);

  return (

     <>
     <div className="grid-orders">
       <div className="grid-nav-1">
         <h4>Útimos pedidos</h4>
         <div className="filter">
         <FormControl fullWidth={true} size="small">
              <Select
                value={statusFiltro}
                onChange={handleChange}
                displayEmpty
                MenuProps={MenuProps}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>Todas os pedidos</em>
                </MenuItem>
                {status.map((name) => (
                  <MenuItem value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
         </div>
       </div>
       <div className="grid-nav-2">
         <h4>Detalhes do pedido</h4>
       </div>
       <div className="grid-sidenav">
         {orders &&
           listaFiltrada.map((p) => (
             <div
               className="card"
               key={p.id}
               onClick={() => handleClick(p.id)}
             >
               <div className="card-head">
                 <h2>{p.id}</h2>
                 {renderIcon(p.status)}
               </div>
               <Typography variant="subtitle1">{p.status}</Typography>
             </div>
           ))}
       </div>
       <div className="grid-content">
       <Details id={id} order={order} endereco={endereco} />     
      </div>
     </div>
   </>
  );
};

export default Orders;
