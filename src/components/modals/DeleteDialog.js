import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IoCloseOutline } from 'react-icons/io5'
import { Alert, Box, CircularProgress } from "@mui/material";

export default function DeleteDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
      >
        <DialogTitle display="flex" justifyContent="space-between" alignItems="center">Deseja realmente excluir? <IoCloseOutline size={30} color="rgba(0,0,0,0.55)" onClick={props.handleClose}/></DialogTitle>
        <DialogContent dividers>
        <Alert severity="warning">Ao confirmar, os dados serão excluídos permanentamente.</Alert>
        </DialogContent>
        <DialogActions>
        {props.loading ? (
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
          <Button onClick={props.handleClose} color="basic">Cancela</Button>
          <Button color="error" onClick={props.handleDelete} autoFocus variant="contained">
            Confirma
          </Button>
          </>)}
        </DialogActions>
      </Dialog>
    </div>
  );
}
