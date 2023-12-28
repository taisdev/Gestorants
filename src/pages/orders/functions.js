import axios from "axios";
import {
  IoBanOutline,
  IoBagCheckOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { BiDish } from "react-icons/bi";
import { MdOutlineDeliveryDining, MdOutlineInfo } from "react-icons/md";

export const renderIcon = (status) => {
  switch (status) {
    case "Em preparo":
      return <BiDish size="30" color="#808080" />;
    case "Pronto para retirada":
      return <IoBagCheckOutline size="30" color="#008000" />;
    case "Pronto para entrega":
      return <IoBagCheckOutline size="30" color="#008000" />;
    case "Aguardando entrega":
      return <MdOutlineDeliveryDining size="30" />;
    case "Cancelado":
      return <IoCloseCircleOutline size="30" color="#FF0000" />;
    case "Concluído":
      return <IoCheckmarkCircleOutline size="30" color="#008000" />;
    case "Rejeitado":
      return <IoBanOutline size="30" color="#FF0000" />;
    case "Aguardando confirmação":
      return <MdOutlineInfo size="30" color="#FFA500" />;
    default:
      return null;
  }
};

export const renderStatus = (order) => {
  const { status, retirada } = order;
  if (status === "Aguardando confirmação") {
    return "Aceitar";
  }
  if (status === "Em preparo" && retirada === "delivery") {
    return "Pronto para entrega";
  }
  if (status === "Em preparo" && retirada === "retirada") {
    return "Pronto para retirada";
  }
  if (status === "Pronto para retirada") {
    return "Concluir";
  }
  if (status === "Pronto para entrega") {
    return "Saiu para entrega";
  }
  if (status === "Aguardando entrega") {
    return "Concluír";
  }
  if (status === "Pronto retirada") {
    return "Concluir";
  }
};

export const updateStatus = (id, order) => {
  const { status, retirada } = order;

  var newStatus = null;

  if (status === "Aguardando confirmação") {
    newStatus = "Em preparo";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
  if (status === "Em preparo" && retirada === "delivery") {
    newStatus = "Pronto para entrega";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
  if (status === "Em preparo" && retirada === "retirada") {
    newStatus = "Pronto para retirada";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
  if (status === "Aguardando entrega") {
    newStatus = "Concluído";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
  if (status === "Pronto para entrega") {
    newStatus = "Aguardando entrega";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
  if (status === "Pronto para retirada") {
    newStatus = "Concluído";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
};

export const cancelarPedido = (id, order) => {
  const status = order.status;
  var newStatus = null;
  if (status === "Aguardando confirmação") {
    axios.delete(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`
    );
  } else {
    newStatus = "Cancelado";
    axios.put(
      `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/${id}`,
      {
        status: newStatus,
      }
    );
  }
};

export const handleRenderData = (orders, handleClick) => {
  return orders.map((p) => (
    <div className="card" key={p.id} onClick={() => handleClick(p.id)}>
      <div className="card-head">
        <h2>{p.id}</h2>
        {renderIcon(p.status)}
      </div>
      <h2>{p.status}</h2>
    </div>
  ));
};
