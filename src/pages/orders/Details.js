import React from "react";
import "./orders.scss";
import { AiFillPrinter } from "react-icons/ai";
import { cancelarPedido, updateStatus, renderStatus } from "./functions";
import moment from "moment";
import image from "../../assets/pedido.jpg";
import { Button, Container, Typography } from "@mui/material";
const Details = ({ id, order, endereco }) => {
  function printerOrder(className) {
    const elementos = document.querySelectorAll(`.${className}`);
    const janelaDeImpressao = window.open("", "", "height=500,width=500");
    elementos.forEach((elemento) => {
      janelaDeImpressao.document.write(elemento.outerHTML);
    });
    janelaDeImpressao.document.close();
    janelaDeImpressao.focus();
    janelaDeImpressao.print();
    janelaDeImpressao.close();
  }

  if (!order) {
    return (
      <Container
        maxWidth="sm"
        display="flex"
        align="center"
        justifyContent="center"
        flexDirection="column"
      >
        <img src={image} alt="pedidos" width="100%" />
        <Typography variant="overline">
          Clique em um pedido para ver os detalhes
        </Typography>
      </Container>
    );
  }
  return (
    <>
      <div className="detail-head" key={order.id}>
        <div className="filter">
          <p>
            Status: <span>{order.status}</span>
          </p>
        </div>
        <button onClick={() => printerOrder("printer")}>
          <AiFillPrinter size={30} />
        </button>
      </div>
      <div className="printer">
        <hr />
        <div className="detail-head">
          <h1>
            <span>Pedido:</span>
            {id}
          </h1>
          <h3>
            <span>Horário:</span>
            { moment(order.data, 'DD-MM-YYYY HH:mm:ss').format('HH:mm') }
           
          </h3>
        </div>
        <div className="detail-client">
          <h3>
            <span>Cliente:</span>
            {order.user.displayName}
          </h3>
          <h3>
            <span>Telefone:</span>
            {order.user.phoneNumber}
          </h3>
          <h3>
            <span>Endereço:</span>
            {endereco.endereco}, {endereco.numero} - {endereco.complemento}
          </h3>
        </div>
        <hr />
        {order.itens.map((item) => (
          <div className="detail-order">
            <div className="item">
              <p>
                <span>X</span>
                {item.quantidade}
              </p>
              <p>{item.nome}</p>
            </div>
            <div className="valor">
              <p>
                <span>R$</span>
                {parseFloat(item.valor).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <hr />
        <div className="subtotal">
          <div>
            <h3>Subtotal</h3>
            <h3>
              <span>R$</span>
              {parseFloat(order.total).toFixed(2)}
            </h3>
          </div>
          <div>
            <h3>Taxa</h3>
            <h3>
              <span>R$</span>
              {parseFloat(order.taxa).toFixed(2)}
            </h3>
          </div>
          <div className="total">
            <h3>TOTAL</h3>
            <h3>
              <span>R$</span>
              {parseFloat(order.total).toFixed(2)}
            </h3>
          </div>
        </div>
        <hr />
        <div className="pagamento">
          <div>
            <h3>Forma de pagamento: </h3>
            <h3>{order.formaPagamento}</h3>
          </div>
          <div>
            <h3>Tipo de serviço:</h3>
            <h3>{order.retirada}</h3>
          </div>
        </div>
        <hr />
      </div>
      <div className="detail-foot">
        {order.status === "Cancelado" ||
        order.status === "Rejeitado" ||
        order.status === "Concluído" ? (
          <></>
        ) : (
          <>
            <Button
              variant="outlined"
              className="--btn"
              color="error"
              onClick={() => cancelarPedido(id, order)}
            >
              {order.status === "Aguardando confirmação"
                ? "Rejeitar"
                : "Cancelar"}
            </Button>
            <Button
              variant="contained"
              className="--btn"
              onClick={() => updateStatus(id, order)}
            >
              {renderStatus(order)}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Details;
