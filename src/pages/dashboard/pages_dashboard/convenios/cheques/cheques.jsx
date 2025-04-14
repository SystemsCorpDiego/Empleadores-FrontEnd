import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Modal,
    Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { axiosCheques } from './chequesApi';

const Cheques = ({ open, handleClose, convenio, cuota, total }) => {

  const [cheques, setCheques] = useState([]);
  const [openChequeNuevo, setOpenChequeNuevo] = useState(false);
  const [resta, setResta] = useState(total);

  const [newCheque, setNewCheque] = useState({
    numero: '',
    monto: '',
    cuota: '',
    idConvenio: '',
  });

  useEffect(() => {
    const fetchCheques = async () => {
      const response = await axiosCheques.consultar(convenio, cuota);
      setCheques(response);
    };
    fetchCheques();
  }, []);

    useEffect(() => {
      const sumatoriaMontosCheques = cheques.reduce(
        (acc, item) => acc + Number(item.monto || 0),
        0,
      );
      console.log(cheques)
      console.log('sumatoria monto cheques: ', sumatoriaMontosCheques)
      console.log('total: ', total)
      setResta(total - sumatoriaMontosCheques);
      console.log(resta)
    }, [cheques, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCheque({ ...newCheque, [name]: value });
  };

  const handleAddCheque = async () => {
    const response = await axiosCheques.crear(newCheque);
    setCheques([...cheques, response]);
    setOpenChequeNuevo(false);
    setNewCheque({ numero: '', monto: '', cuota: '', idConvenio: '' });
  };

  const columns = [
    //{ field: 'id', headerName: 'ID', width: 90 },
    { field: 'numero', headerName: 'Número', width: 150 },
    { field: 'monto', headerName: 'Monto', width: 150 },
    { field: 'cuota', headerName: 'Cuota', width: 150 },
    //{ field: 'idConvenio', headerName: 'ID Convenio', width: 150 },
  ];

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <div style={{ height: 400, width: '100%' }}>
        <h2 >Cheques convenio Nro {convenio} / Nro. Cuota {cuota} </h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenChequeNuevo(true)}
          >
            Crear Nuevo Cheque
          </Button>
          <DataGrid
            rows={cheques}
            columns={columns}
            pageSize={4}
            rowsPerPageOptions={[5]}
            getRowClassName={(params) =>
                cheques.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
              }
          />
          <Dialog open={openChequeNuevo} onClose={() => setOpenChequeNuevo(false)}>
            <DialogTitle>Crear Nuevo Cheque</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                name="numero"
                label="Número"
                type="text"
                fullWidth
                value={newCheque.numero}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="monto"
                label="Monto"
                type="number"
                fullWidth
                value={newCheque.monto}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="cuota"
                label="Cuota"
                type="number"
                fullWidth
                value={newCheque.cuota}
                onChange={handleInputChange}
              />
              
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenChequeNuevo(false)} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleAddCheque} color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div style={{ marginTop: '150px' }}>
          <h3>Total restante cuota 1: {resta}</h3>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default Cheques;
