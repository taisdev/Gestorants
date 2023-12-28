import React, { useContext, useState } from "react";
import "./menu.scss";
import {
  Fab,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Item from "../../components/item/Item";
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import LightTooltip from "../../components/tooltip/Tooltip";
import DeleteDialog from "../../components/modals/DeleteDialog";
import { ToastContainer, toast } from "react-toastify";
import CategoryForm from "../../components/modals/CategoryForm";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase/config";
import MenuContext from "../../context/menuContext";
import ItemForm from "../../components/modals/ItemForm";

const Category = ({ categorias }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(-1);
  const [isHovering, setIsHovering] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const { itens, deleteCategoria, updateItemAtivo, deleteItem } =
    useContext(MenuContext);

  const handleChange = async (id, event) => {
    updateItemAtivo(id, event.target.checked);
  };

  const handleMouseEnter = (index) => {
    setActiveCategoryIndex(index);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setActiveCategoryIndex(-1);
    setIsHovering(false);
  };

  const handleOpenModal = (categoria) => {
    setOpenModal(true);
    setIsEditing(true);
    setCategoria(categoria);
  };

  const handleOpen = (item) => {
    setOpen(true);
    setItem(item);
  };

  const handleOpenFormModal = (item) => {
    setOpenFormModal(true);
    if (item != null) {
      setIsEditing(true);
    }
    setItem(item);
  };

  const handleAlertOpen = (item) => {
    setAlertOpen(true);
    setCategoria(item);
  };

  const handleAlertClose = () => {
    setOpen(false);
    setAlertOpen(false);
    setOpenFormModal(false);
    setOpenModal(false);
    setIsEditing(false);
    setId("");
    setItem(null);
    setCategoria(null);
  };

  const handleDeleteCategory = async () => {
    setLoading(true);
    try {
      const imageRef = ref(storage, "categorias_imagens/" + categoria.refImage);
      await deleteObject(imageRef);
      const response = await deleteCategoria(categoria.id);
      if (response.status === 200) {
        setLoading(false);
        handleAlertClose();
        toast.success("Categoria deletada com sucesso", {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setLoading(false);
      handleAlertClose();
      toast.error("Erro ao excluir categoria", {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    try {
      const imageRef = ref(
        storage,
        "categorias_imagens/itens/" + item.refImage
      );
      await deleteObject(imageRef);
      const response = await deleteItem(item.id);
      if (response.status === 200) {
        setLoading(false);
        handleAlertClose();
        toast.success("Item deletado com sucesso", {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      setLoading(false);
      handleAlertClose();
      toast.error("Erro ao excluir item", {
        position: "top-right",
        theme: "light",
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      {alertOpen && (
        <DeleteDialog
          open={alertOpen}
          loading={loading}
          handleClose={handleAlertClose}
          handleDelete={handleDeleteCategory}
        />
      )}
      {open && (
        <DeleteDialog
          open={open}
          loading={loading}
          handleClose={handleAlertClose}
          handleDelete={handleDeleteItem}
        />
      )}
      {openModal && (
        <CategoryForm
          categoria={categoria}
          open={openModal}
          isEditing={isEditing}
          handleClose={handleAlertClose}
        />
      )}
      {openFormModal && (
        <ItemForm
          item={item}
          id={id}
          open={openFormModal}
          isEditing={isEditing}
          handleClose={handleAlertClose}
        />
      )}
      {categorias.map((category, index) => (
        <>
          <Grid
            xs={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Item sx={{ "& > :not(style)": { m: 2 } }} elevation={0}>
              <Typography variant="h5">{category.descricao}</Typography>
            </Item>
            <Item elevation={0} sx={{ "& > :not(style)": { m: 1 } }}>
              {index === activeCategoryIndex && (
                <>
                  <LightTooltip title="Adicionar item" placement="bottom">
                    <Zoom
                      in={isHovering}
                      style={{ transitionDelay: isHovering ? "500ms" : "0ms" }}
                    >
                      <Fab
                        size="small"
                        color="primary"
                        onClick={() => setId(category.id)}
                      >
                        <HiOutlinePlus
                          size={15}
                          onClick={() => handleOpenFormModal(null)}
                        />
                      </Fab>
                    </Zoom>
                  </LightTooltip>
                  <LightTooltip title="Editar" placement="bottom">
                    <Zoom
                      in={isHovering}
                      style={{ transitionDelay: isHovering ? "600ms" : "0ms" }}
                    >
                      <Fab
                        size="small"
                        onClick={() => handleOpenModal(category)}
                      >
                        <HiOutlinePencil size={15} />
                      </Fab>
                    </Zoom>
                  </LightTooltip>

                  <LightTooltip title="Excluir" placement="bottom">
                    <Zoom
                      in={isHovering}
                      style={{ transitionDelay: isHovering ? "700ms" : "0ms" }}
                    >
                      <Fab
                        size="small"
                        color="warning"
                        onClick={() => handleAlertOpen(category)}
                      >
                        <HiOutlineTrash size={15} />
                      </Fab>
                    </Zoom>
                  </LightTooltip>
                </>
              )}
            </Item>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            xs={12}
            alignItems="center"
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }}>
                <TableBody>
                  {itens
                    .filter((item) => item.categoriaId === category.id)
                    .map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">
                          <img
                            src={item.urlImage}
                            alt="item"
                            className="img-item"
                          />
                        </TableCell>
                        <TableCell align="left">{item.nome}</TableCell>
                        <TableCell align="left" sx={{ maxWidth: 200 }}>
                          {item.descricao}
                        </TableCell>
                        <TableCell align="left" sx={{ minWidth: 100 }}>
                          R$ {item.valor}
                        </TableCell>
                        <TableCell align="left">{item.tamanho}</TableCell>
                        <TableCell align="left">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            Pausar
                            <Switch
                              checked={item.ativo}
                              onChange={(event) => handleChange(item.id, event)}
                            />
                            Ativar
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <LightTooltip
                            title="Editar"
                            placement="bottom"
                            TransitionComponent={Zoom}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenFormModal(item)}
                            >
                              <HiOutlinePencil size={20} />
                            </IconButton>
                          </LightTooltip>
                        </TableCell>
                        <TableCell align="right">
                          <LightTooltip
                            title="Excluir"
                            placement="bottom"
                            TransitionComponent={Zoom}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => handleOpen(item)}
                            >
                              <HiOutlineTrash size={20} />
                            </IconButton>
                          </LightTooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      ))}
    </Grid>
  );
};

export default Category;
