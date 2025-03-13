import React, { useContext, useMemo, useState, useEffect } from 'react';

import { Modal, Box, TextField, IconButton, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Cheques = ({ open, handleClose, cheques, setCheques, total }) => {
    console.log(total)
  const [resta, setResta] = useState(total)
  console.log(resta)
  const agregarFila = () => {
    setCheques([...cheques, { id: cheques.length + 1, numero: "", monto: "" }]);
  };

  const handleChange = (index, field, value) => {
    const nuevosCheques = [...cheques];
    nuevosCheques[index][field] = value;
    setCheques(nuevosCheques);
  };

  const hadleSave = () =>{
    console.log(cheques)
    handleClose()
  }
  useEffect(()=>setResta(total),[])
  
  useEffect(() => {
    const sumatoriaMontosCheques = cheques.reduce((acc, item) => acc + Number(item.monto || 0), 0);
    setResta(total - sumatoriaMontosCheques);
  }, [cheques, total]); // Ahora `resta` se actualiza correctamente cuando `total` cambia
  
  //let total = cheques.map(cheque => resta)

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <h2>Ingresar Cheques</h2>
        {cheques.map((cheque, index) => (
          <Box key={cheque.id} sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="Número de Cheque"
              variant="outlined"
              fullWidth
              value={cheque.numero}
              onChange={(e) => handleChange(index, "numero", e.target.value)}
            />
            <TextField
              label="Monto"
              variant="outlined"
              fullWidth
              type="number"
              value={cheque.monto}
              onChange={(e) => handleChange(index, "monto", e.target.value)}
            />
          </Box>
        ))}

        <IconButton onClick={agregarFila} color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
        <h3>Resta ${resta.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={hadleSave}>
            Guardar
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose} sx={{ ml: 2 }}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Cheques;
