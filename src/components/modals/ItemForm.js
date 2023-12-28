import React, { useContext, useState } from "react";
import {
    Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { AiFillCamera } from "react-icons/ai";
import load from "../../assets/imagem.png";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/config";
import { toast } from "react-toastify";
import MenuContext from "../../context/menuContext";

export default function ItemForm({
  id,
  item,
  open,
  handleClose,
  isEditing,
}) {
  const [name, setName] = useState(isEditing ? item.nome : "");
  const [description, setDescription] = useState(
    isEditing ? item.descricao : "" 
  );
  const [urlImagem, setUrlImagem] = useState(isEditing ? item.urlImage : "");
  const [imagemUrl, setImagemUrl] = useState(isEditing ? item.urlImage : "");
  const [imagem, setImagem] = useState(load);
  const [value, setValue] = useState(isEditing ? item.valor : "");
  const [size, setSize] = useState(isEditing ? item.tamanho : "");
  const [active, setActive] = useState(isEditing ? item.ativo : true);
  const [loading, setLoading] = useState(false);

  const { createItem, updateItem } = useContext(MenuContext);

  const handleImageChange = (event) => {
    if (isEditing) {
        const imageRef = ref(storage, 'categorias_imagens/itens/' + item.refImage);
        deleteObject(imageRef);
        console.log('imagem deletada');
    }
    console.log('id', id);
    setUrlImagem(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setImagem(reader.result);
      setImagemUrl(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const file = urlImagem;      
      const storagePath = "categorias_imagens/itens/" + file.name;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      const data = {
         nome: name,
         descricao: description,
         valor:value,
         tamanho: size,
         ativo: active,
         urlImage: imageUrl,
         refImage: file.name,
         categoriaId: id,
      }
      const response = await createItem(data);
      console.log("createItem from form");
      if (response.status === 201) {
        setLoading(false);
        handleClose();
        toast.success("Item adicionado com sucesso", {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      handleClose();
      toast.error("Erro ao adicionar item", {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (urlImagem === imagemUrl) {
          const data = {
            nome: name,
            descricao: description,
            valor:value,
            tamanho: size,
            ativo: active,
            urlImage: urlImagem,
            refImage: item.refImage,
         }
         const response = await updateItem(item.id, data);
         if (response.status === 200) {
          setLoading(false);
          handleClose();
          toast.success("Item atualizado com sucesso", {
            position: "top-right",
            theme: "light",
          });
        }

        } else {
          const file = urlImagem;
          const storagePath = "categorias_imagens/itens/" + file.name;
          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          const data = {
           nome: name,
           descricao: description,
           valor:value,
           tamanho: size,
           ativo: active,
           urlImage: imageUrl,
           refImage: file.name,
        }
        const response = await updateItem(item.id, data);
        if (response.status === 200) {
          setLoading(false);
          handleClose();
          toast.success("Item atualizado com sucesso", {
            position: "top-right",
            theme: "light",
          });
        }
        }
    } catch (error) {
      console.error(error);
      setLoading(false);
      handleClose();
      toast.error("Erro ao atualiz item", {
        position: "top-right",
        theme: "light",
      });
    } 
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Adicionar item" : "Editar item"}</DialogTitle>
      <DialogContent
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
        }}
      >
        <Stack direction="row" alignItems="flex-end" spacing={2}>
          {imagem && (
            <img
              src={isEditing ? imagemUrl : imagem}
              alt="Imagem selecionada"
              width={100}
            />
          )}
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{padding: 0}}
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
        <TextField
          label="Nome"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          variant="standard"
        />
        <TextField
          label="R$"
          variant="standard"
          value={value}
          required
          onChange={(event) => setValue(event.target.value)}
        />
        <TextField
          label="Descrição"
          variant="standard"
          value={description}
          required
          onChange={(event) => setDescription(event.target.value)}
          fullWidth
        />
        <Stack direction="row" alignItems="flex-end" spacing={2}>
        <TextField
          label="Tamanho"
          variant="standard"
          value={size}
          required
          onChange={(event) => setSize(event.target.value)}
        />
        <FormControlLabel
          sx={{ fontSize: 16 }}
          value="bottom"
          control={
            <Checkbox
              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 }, padding:0 }}
              defaultChecked
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
          }
          label="ativo"
        />
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
        </>) }
      </DialogActions>
    </Dialog>
  );
}
