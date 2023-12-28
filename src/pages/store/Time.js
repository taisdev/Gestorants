import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";

const Time = () => {
  const [open, setOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioEncerramento, setHorarioEncerramento] = useState("");
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/estabelecimento/loja"
        );
        const data = response.data;
        if (data.horarioFuncionamento) {
          setHorarioInicio(data.horarioFuncionamento.horarioInicio);
          setHorarioEncerramento(data.horarioFuncionamento.horarioEncerramento);
          setSelectedDays(data.horarioFuncionamento.diasSemana);
          setIsEmpty(true);
          setIsLoading(false);
        } else {
          setIsEmpty(false);
          setIsLoading(false);
        }
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const currentTime = new Date();
  
      const [inicioHour, inicioMinute] = horarioInicio.split(":").map(Number);
      const [encerramentoHour, encerramentoMinute] = horarioEncerramento.split(":").map(Number);
  
      const inicioTime = new Date();
      inicioTime.setHours(inicioHour, inicioMinute);
  
      const encerramentoTime = new Date();
      encerramentoTime.setHours(encerramentoHour, encerramentoMinute);
  
      if (currentTime >= inicioTime && currentTime <= encerramentoTime) {
        console.log(true);
        setOpen(true);
        
      } else {
        console.log(false);
        setOpen(false);
      }
      const saveOpenStatus = async () => {
        try {
          const data = {
            open: open,
          };
          await axios.put(
            "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/estabelecimento/estabelecimentoId",
            data
          );
         
        } catch (error) {
          console.error("Erro ao salvar o status 'open':", error);
        }
      };
  
      saveOpenStatus();
    }
  }, [open]);


  const handleTimeChange = (event, setTimeState) => {
    event.preventDefault();
    setTimeState(event.target.value);
    setOpen(!open);
    setIsChange(true);
  };

  const handleHorarioInicioChange = (event) => {
    handleTimeChange(event, setHorarioInicio);
  };

  const handleHorarioEncerramentoChange = (event) => {
    handleTimeChange(event, setHorarioEncerramento);
  };

  const handleDayChange = (event) => {
    event.preventDefault();
    const { name, checked } = event.target;
    setSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [name]: checked,
    }));
    setIsChange(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const data = {
        horarioFuncionamento: {
          horarioInicio,
          horarioEncerramento,
          diasSemana: selectedDays,
        },
        open: open,
      };
      await axios.put(
        "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/estabelecimento/estabelecimentoId",
        data
      );
      toast.success("Dados salvos com sucesso", {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
      });
      setIsChange(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      setIsLoading(false);
      toast.error("Erro ao salvar os dados", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  return (
    <Grid container spacing={2}>
      {isLoading && <Loading />}
      <Grid
        item
        md={12}
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Status:</Typography>
          <Typography
            variant="body1"
            style={{ color: open ? "green" : "red" }}
          >
            {open ? "Loja aberta" : "Loja fechada"}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Horário:</Typography>

          <TextField
            label="Das"
            variant="standard"
            required
            value={horarioInicio}
            onChange={handleHorarioInicioChange}
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="até"
            variant="standard"
            required
            value={horarioEncerramento}
            onChange={handleHorarioEncerramentoChange}
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Dias:</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.monday}
                onChange={handleDayChange}
                name="monday"
              />
            }
            label="Monday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.tuesday}
                onChange={handleDayChange}
                name="tuesday"
              />
            }
            label="Tuesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.wednesday}
                onChange={handleDayChange}
                name="wednesday"
              />
            }
            label="Wednesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.thursday}
                onChange={handleDayChange}
                name="thursday"
              />
            }
            label="Thursday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.friday}
                onChange={handleDayChange}
                name="friday"
              />
            }
            label="Friday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.saturday}
                onChange={handleDayChange}
                name="saturday"
              />
            }
            label="Saturday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDays.sunday}
                onChange={handleDayChange}
                name="sunday"
              />
            }
            label="Sunday"
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
        {isChange && isEmpty && (
          <Button size="small" variant="contained" onClick={handleSubmit}>
            Salvar alterações
          </Button>
        )}

        {!isEmpty && isChange && (
          <Button size="small" variant="contained" onClick={handleSubmit}>
            Adicionar
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Time;
