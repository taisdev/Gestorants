import React, { useState } from "react";
import "./sidebar.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  RiMenuUnfoldFill,
  RiMenuFoldFill,
} from "react-icons/ri";
import {
  BsReceiptCutoff,
  BsBook,
  BsShopWindow,
  BsGraphUpArrow,
  BsBoxArrowRight,
  BsPersonCircle,
} from "react-icons/bs";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ErrorMensage from "../../firebase/errorMensage";
import logoImg from "../../assets/logo.png";
import { auth } from "../../firebase/config";
import { UserAuth } from "../../context/authContext";
import { IconButton, Stack, Typography } from "@mui/material";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = UserAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = ErrorMensage(errorCode);
      toast.error(errorMessage);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);

  };

  return (
    <>
      <ToastContainer />
      <header style={{ display: auth.currentUser ? "" : "none" }}>
        <nav>
          <div className={isOpen ? "top_section" : "top_section_closed"}>
            <div className="logo">
              {isOpen ? (
                <>
                  <img src={logoImg} alt="logo" /> <span>Gestorants</span>{" "}
                </>
              ) : (
                <img src={logoImg} alt="logo" />
              )}
            </div>
          </div>
          <div className="flex-right --mr" >
            <div className="bars">
                <IconButton onClick={toggleMenu}>
                  {isOpen ? (
                    <RiMenuFoldFill color="#fff" size={25} />
                  ) : (
                    <RiMenuUnfoldFill color="#fff" size={25} />
                  )}
                </IconButton>
            </div>
            <Stack direction="row" spacing={1} alignItems="center">
              <BsPersonCircle size="20" color="#fff" />
              <Typography color="#fff">{user.user}</Typography>
            </Stack>
          </div>
        </nav>
      </header>
      <div className="container">
        <div
          className={isOpen ? "sidebar" : "sidebar_closed"}
          style={{ display: auth.currentUser ? "" : "none" }}
        >
          <span>
            <NavLink to="/pedidos" className="link" activeclassame="active">
              <div className="icon">
                <BsReceiptCutoff />
              </div>
              <div className="link_text">Pedidos</div>
            </NavLink>
            <NavLink to="/cardapio" className="link" activeclassname="active">
              <div className="icon">
                <BsBook />
              </div>
              <div className="link_text">Cardápio</div>
            </NavLink>
            {user.typeAccount === "admin" && (
              <>
                  <NavLink
                    to="/loja/0"
                    className="link"
                    activeclassname="active"
                  >
                        <div className="icon">
                          <BsShopWindow />
                        </div>
                        <div className="link_text">Loja</div>
                  </NavLink>
                  
                <NavLink
                  to="/relatorios"
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">
                    <BsGraphUpArrow />
                  </div>
                  <div className="link_text">Relatórios</div>
                </NavLink>
              </>
            )}
          </span>
          <NavLink
            to="/login"
            className="link last"
            activeclassname="active"
            onClick={handleLogout}
          >
            <div className="icon">
              <BsBoxArrowRight />
            </div>
            <div className="link_text">Sair</div>
          </NavLink>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Sidebar;
