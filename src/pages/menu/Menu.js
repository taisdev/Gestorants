import React, { useContext, useState } from "react";
import "./menu.scss";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import Category from "./Category";
import Loading from "../../components/loader/Loading";
import CategoryForm from "../../components/modals/CategoryForm";
import MenuContext from "../../context/menuContext";

const Cardapio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const { categorias, isLoading } = useContext(MenuContext);

  const handleOpen= () => {
    setOpen(true);
    setIsEditing(false);
  };

  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <section className="menu">
      {open && <CategoryForm open={open} isEditing={isEditing} handleClose={handleClose}/>}
      {isLoading && <Loading />}
      <Grid container spacing={3}>
        <Grid md={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Cardápio</Typography>
          <Button variant="contained" endIcon={<HiOutlineViewGridAdd />} onClick={handleOpen}>
            Adicionar categoria
          </Button>
        </Grid>
        <Grid
          md={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          className="--bg-light"
        >
          <Category categorias={categorias}/>
        </Grid>
      </Grid>
    </section>
  );
};

export default Cardapio;
