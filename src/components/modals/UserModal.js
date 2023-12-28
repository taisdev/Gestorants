import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import ErrorMensage from "../../firebase/errorMensage";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function UserModal({
  open,
  handleClose,
  funcionario,
  fetchData,
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfil, setPerfil] = useState("");
  const [cargo, setCargo] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (funcionario) {
      setNome(funcionario.nome);
      setEmail(funcionario.email);
      setPassword(funcionario.password);
      setPerfil(funcionario.perfil);
      setCargo(funcionario.cargo);
    } else {
      setNome("");
      setEmail("");
      setPassword("");
      setPerfil("");
      setCargo("");
    }
  }, [funcionario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (funcionario) {
        console.log(funcionario);
        await axios.put(
          `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/funcionario/${funcionario.id}`,
          { nome, email, password, perfil, cargo }
        );
        toast.success("Colaborador atualizado com sucesso!");
      } else {
        await axios.post(
          "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/funcionario",
          { nome, email, password, perfil, cargo }
        );
        toast.success("Colaborador criado com sucesso!");
      }
      await handleClose();
      fetchData();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = ErrorMensage(errorCode);
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {funcionario ? "Editar colaborador" : "Adicionar colaborador"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              "& > :not(style)": { my: 1 },
            }}
          >
            <TextField
              label="Nome"
              required
              value={nome}
              fullWidth
              onChange={(event) => setNome(event.target.value)}
              type="text"
              variant="standard"
            />
            <TextField
              label="E-mail"
              variant="standard"
              value={email}
              type="email"
              required
              fullWidth
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              label="Senha"
              variant="standard"
              value={password}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={togglePasswordVisibility}
                    variant="outlined"
                  >
                     {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </IconButton>
                ),
              }}
              required
              fullWidth
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              label="Cargo"
              variant="standard"
              value={cargo}
              required
              onChange={(event) => setCargo(event.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <Select
                sx={{ marginTop: 2 }}
                value={perfil}
                displayEmpty
                onChange={(event) => setPerfil(event.target.value)}
                MenuProps={MenuProps}
                inputProps={{ "aria-label": "Without label" }}
                variant="standard"
              >
                <MenuItem value="">
                  <em>Tipo de perfil</em>
                </MenuItem>
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="user">user</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              {funcionario ? "Salvar" : "Adicionar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
