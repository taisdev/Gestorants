import React, { useEffect } from "react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi2";
import { MdOutlineManageSearch } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  IconButton,
  TablePagination,
  Grid,
  TextField,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Loading from "../../components/loader/Loading";
import moment from "moment";

const Row = ({ row }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TableRow key={row.id}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiChevronUp /> : <HiChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{moment(row.data, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")}</TableCell>
        <TableCell>{row.itens.length}</TableCell>
        <TableCell>{row.user.displayName}</TableCell>
        <TableCell>
          <span>R$</span>
          {parseFloat(row.total).toFixed(2)}
        </TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.retirada}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Valor unitário</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.itens.map((detailRow) => (
                    <TableRow key={detailRow.descricao}>
                      <TableCell component="th" scope="row">
                        {detailRow.nome}
                      </TableCell>
                      <TableCell>{detailRow.quantidade}</TableCell>
                      <TableCell>
                        <span>R$</span>
                        {parseFloat(detailRow.valor).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Sales = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const filteredOrders = orders.filter((row) => row.status !== "Aguardando confirmação");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuscarClick = () => {
    setIsLoading(true);
    const formattedDataInicial = moment(dataInicial, "YYYY-MM-DD").format("DD-MM-YYYY");
    const formattedDataFinal = moment(dataFinal, "YYYY-MM-DD").format("DD-MM-YYYY");
    const url = `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido/data/${formattedDataInicial}/${formattedDataFinal}`;
    
    axios
      .get(url)
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(
        "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/pedido"
      )
      .then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataInicialChange = (event) => {
    event.preventDefault();
    setDataInicial(event.target.value);
  };

  const handleDataFinalChange = (event) => {
    event.preventDefault();
    setDataFinal(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid
        md={12}
        className="--my"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1">De:</Typography>

          <TextField
            variant="standard"
            required
            value={dataInicial}
            onChange={handleDataInicialChange}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Typography variant="subtitle1">Até:</Typography>
          <TextField
            variant="standard"
            required
            value={dataFinal}
            onChange={handleDataFinalChange}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            size="small"
            variant="outlined"
            endIcon={<MdOutlineManageSearch />}
            onClick={handleBuscarClick}
          >
            buscar
          </Button>
        </Stack>
      </Grid>
      <TableContainer component={Paper}>
        {isLoading && <Loading />}
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Total de Itens</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tipo de Serviço</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row.id} row={row} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Grid>
  );
};

export default Sales;
