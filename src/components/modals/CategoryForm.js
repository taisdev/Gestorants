import React, { useContext, useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../firebase/config";
import load from "../../assets/imagem.png";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import MenuContext from "../../context/menuContext";

export default function CategoryForm({
  categoria,
  open,
  handleClose,
  isEditing,
}) {
  const [descricao, setDescricao] = useState(
    isEditing ? categoria.descricao : ""
  );
  const [imagemUrl, setImagemUrl] = useState(
    isEditing ? categoria.urlImage : ""
  );
  const [imageUrl, setImageUrl] = useState(isEditing ? categoria.urlImage : "");
  const [imagem, setImagem] = useState(load);
  const [loading, setLoading] = useState(false);
  const { createCategoria, updateCategoria } = useContext(MenuContext);

  const handleImageChange = (event) => {
    if (isEditing) {
      const imageRef = ref(storage, "categorias_imagens/" + categoria.refImage);
      deleteObject(imageRef);
      console.log("imagem deletada");
    }
    setImagemUrl(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setImagem(reader.result);
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const file = imagemUrl;
      const storagePath = "categorias_imagens/" + file.name;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      const data = {
        descricao: descricao,
        urlImage: imageUrl,
        refImage: file.name,
      };
      const response = await createCategoria(data);
      if (response.status === 201) {
        setLoading(false);
        handleClose();
        toast.success("Categoria adicionada com sucesso", {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      handleClose();
      toast.error("Erro ao adicionar categoria", {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(imagemUrl === imageUrl) {
        const data = {
          descricao: descricao,
          urlImage: imageUrl,
          refImage: categoria.refImage,
        };
        const response = await updateCategoria(categoria.id, data);
        if (response.status === 200) {
          setLoading(false);
          handleClose();
          toast.success("Categoria atualizada com sucesso", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }
      } else {

        const file = imagemUrl;
        const storagePath = "categorias_imagens/" + file.name;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const urlImage = await getDownloadURL(storageRef);
        const data = {
          descricao: descricao,
          urlImage: urlImage,
          refImage: file.name,
        };
        const response = await updateCategoria(categoria.id, data);
        if (response.status === 200) {
          setLoading(false);
          handleClose();
          toast.success("Categoria atualizada com sucesso", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      handleClose();
      toast.error("Erro ao atualizar categoria", {
        position: "top-right",
        theme: "light",
      });
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {!isEditing ? "Adicionar categoria" : "Editar categoria"}
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            {imagem && (
              <img
                src={isEditing ? imageUrl : imagem}
                alt="Imagem selecionada"
                width={80}
              />
            )}
            <TextField
              sx={{ py: 2 }}
              autoFocus
              margin="dense"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              label="Nome da categoria"
              type="text"
              fullWidth
              variant="standard"
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
              <AiFillCamera size={30} />
            </IconButton>
          </Stack>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Button color="error" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={isEditing ? handleUpdate : handleSubmit}
              >
                {isEditing ? "Salvar" : "Adicionar"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
