import React, { useEffect, useState } from "react";
import { Button, Grid, Stack, TextField } from "@mui/material";
import axios from "axios";
import Loading from "../../components/loader/Loading";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";

const Form = () => {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [isChange, setIsChange] = useState(false);
  const [isEmpt, setIsEmpt] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNomeChange = (event) => {
    setNome(event.target.value);
    setIsChange(true);
  };

  const handleCnpjChange = (event) => {
    setCnpj(event.target.value);
    setIsChange(true);
  };

  const handleEnderecoChange = (event) => {
    setEndereco(event.target.value);
    setIsChange(true);
  };

  const handleResponsavelChange = (event) => {
    setResponsavel(event.target.value);
    setIsChange(true);
  };

  const handleTelefoneChange = (event) => {
    setTelefone(event.target.value);
    setIsChange(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsChange(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newData = {
        nome,
        cnpj,
        endereco,
        responsavel,
        telefone,
        email,
      };

      if (isDataLoaded) {
        // Realizar uma requisição PUT para atualizar os dados
        await axios.put(
          "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/estabelecimento/estabelecimentoId",
          newData
        );
        fetchData();
        setIsLoading(false);
        toast.success("Dados atualizados com sucesso", {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      } else {
        // Realizar uma requisição POST para adicionar os dados
        await axios.post(
          "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/estabelecimento",
          newData
        );
        setIsLoading(false);
        toast.success("Dados adicionados com sucesso", {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      }
      setIsChange(false);
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/estabelecimento/loja"
      );
      const data = response.data;
      if (data) {
        setNome(data.nome);
        setCnpj(data.cnpj);
        setEndereco(data.endereco);
        setResponsavel(data.responsavel);
        setTelefone(data.telefone);
        setEmail(data.email);
        setIsChange(false);
        setIsDataLoaded(true);
        setIsLoading(false);
      } else {
        setIsEmpt(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      {isLoading && <Loading />}
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 5 }}>
          <TextField
            label="Nome"
            required
            value={nome}
            onChange={handleNomeChange}
            type="text"
            variant="standard"
            fullWidth
          />
          <InputMask
            mask="99.999.999/9999-99"
            value={cnpj}
            onChange={handleCnpjChange}
          >
            {() => (
              <TextField
                label="CNPJ"
                variant="standard"
                value={cnpj}
                required
                fullWidth
                onChange={handleCnpjChange}
              />
            )}
          </InputMask>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 5 }}>
          <TextField
            label="Responsável"
            variant="standard"
            value={responsavel}
            required
            onChange={handleResponsavelChange}
            fullWidth
          />
          <TextField
            label="Email"
            variant="standard"
            value={email}
            required
            fullWidth
            onChange={handleEmailChange}
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 5 }}>
          <InputMask
            mask="99 9999-9999"
            value={telefone}
            onChange={handleTelefoneChange}
          >
            {() => (
              <TextField
                label="Telefone"
                variant="standard"
                value={telefone}
                required
                fullWidth
                onChange={handleTelefoneChange}
              />
            )}
          </InputMask>
          <TextField
            label="Endereço"
            variant="standard"
            value={endereco}
            required
            fullWidth
            onChange={handleEnderecoChange}
          />
        </Stack>
      </Grid>

      <Grid
        item
        xs={12}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {isChange && !isEmpt && (
          <Button size="small" variant="contained" onClick={handleSubmit}>
            Salvar alterações
          </Button>
        )}

        {isEmpt && isChange && (
          <Button size="small" variant="contained" onClick={handleSubmit}>
            Adicionar
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Form;
