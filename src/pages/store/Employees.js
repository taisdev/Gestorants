import React, { useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
  TablePagination,
} from "@mui/material";
import DeleteDialog from "../../components/modals/DeleteDialog";
import UserModal from "../../components/modals/UserModal";
import LightTooltip from "../../components/tooltip/Tooltip";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";

const Employees = () => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpen = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setOpen(true);
  };

  const handleAlertOpen = (funcionario) => {
    setAlertOpen(true);
    setSelectedFuncionario(funcionario);
  };

  const handleAlertClose = () => {
    setIsLoading(true);
    setOpen(false);
    setAlertOpen(false);
    setSelectedFuncionario(null);
    fetchData();
    setIsLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/funcionario"
      );
      const data = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
      setFuncionarios(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://us-central1-api-app-delivery-992fa.cloudfunctions.net/app/funcionario/${selectedFuncionario.id}`
      );
      fetchData();
      handleAlertClose();
      setIsLoading(false);
      toast.success("Colaborador excluído com sucesso!");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Erro ao excluir colaborador");
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <>
    {isLoading && <Loading />}
      {open && (
        <UserModal
          open={open}
          handleClose={handleAlertClose}
          funcionario={selectedFuncionario}
          fetchData={fetchData}
        />
      )}
      {alertOpen && (
        <DeleteDialog
          open={alertOpen}
          handleClose={handleAlertClose}
          handleDelete={handleDelete}
        />
      )}
      <Grid
        md={12}
        className="--my"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Colaboradores</Typography>
        <Button
          variant="contained"
          endIcon={<AiOutlineUserAdd />}
          onClick={() => handleOpen(null)}
        >
          Adicionar colaborador
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">E-mail</TableCell>
              <TableCell align="center">Perfil</TableCell>
              <TableCell align="center">Cargo</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios.slice(startIndex, endIndex).map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.nome}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.perfil}</TableCell>
                <TableCell align="center">{row.cargo}</TableCell>
                <TableCell align="right">
                  <LightTooltip
                    title="Editar"
                    placement="bottom"
                    TransitionComponent={Zoom}
                  >
                    <IconButton color="primary" onClick={() => handleOpen(row)}>
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
                      onClick={() => handleAlertOpen(row)}
                    >
                      <HiOutlineTrash size={20} />
                    </IconButton>
                  </LightTooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={funcionarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default Employees;
