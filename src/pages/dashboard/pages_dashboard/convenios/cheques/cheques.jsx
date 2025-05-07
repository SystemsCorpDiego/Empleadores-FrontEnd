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
import formatter from '@/common/formatter';

const Cheques = ({ open, handleClose, convenio, cuota, total }) => {
  const [cheques, setCheques] = useState([]);
  const [openChequeDialog, setOpenChequeDialog] = useState(false);
  const [resta, setResta] = useState(total);
  const [editing, setEditing] = useState(false);

  const [newCheque, setNewCheque] = useState({
    numero: '',
    monto: '',
    cuota,
    idConvenio: convenio,
  });

  useEffect(() => {
    const fetchCheques = async () => {
      const response = await axiosCheques.consultar(convenio, cuota);
      setCheques(response);
    };
    fetchCheques();
  }, [convenio, cuota]);

  useEffect(() => {
    const totalCheques = cheques.reduce((sum, item) => sum + Number(item.monto || 0), 0);
    setResta(total - totalCheques);
  }, [cheques, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCheque({ ...newCheque, [name]: value });
  };

  const handleSaveCheque = async () => {
    let response;
    if (editing) {
      response = await axiosCheques.actualizar(newCheque);
      setCheques(cheques.map((c) => (c.id === newCheque.id ? response : c)));
    } else {
      response = await axiosCheques.crear({ ...newCheque, cuota, idConvenio: convenio });
      setCheques([...cheques, response]);
    }
    resetChequeForm();
  };

  const resetChequeForm = () => {
    setNewCheque({ numero: '', monto: '', cuota, idConvenio: convenio });
    setOpenChequeDialog(false);
    setEditing(false);
  };

  const handleEditCheque = (id) => {
    const cheque = cheques.find((c) => c.id === id);
    setNewCheque(cheque);
    setEditing(true);
    setOpenChequeDialog(true);
  };

  const handleDeleteCheque = async (id) => {
    const response = await axiosCheques.eliminar(id);
    setCheques(response);
  };

  const columns = [
    { field: 'cuota', headerName: 'Cuota', flex: 1, align:'center' },
    { field: 'monto', headerName: 'Monto', flex: 1, align:'right', valueFormatter: (params) => formatter.currency.format(params.value || 0) },
    { field: 'numero', headerName: 'Número Cheque', flex: 1, align:'center' },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditCheque(params.row.id)}>
            Editar
          </Button>

          <Button variant="contained" color="primary" style={{ marginLeft: '5px' }}
            onClick={() => handleDeleteCheque(params.row.id)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <Modal open={open} onClose={handleClose} height={800}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 650,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>Cheques convenio Nro {convenio} / Cuota {cuota}</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenChequeDialog(true)}
          disabled={resta <= 0}
        >
          Cargar Cheque
        </Button>
        <div style={{ height: 390, width: '100%', marginTop: 20 }}>

          <DataGrid
            rows={cheques}
            columns={columns}
            pageSize={4}
            getRowId={(row) => row.id}
            rowsPerPageOptions={[5]}
            height={300}
            sx={{
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                width: '8px',
                visibility: 'visible',
              },
              '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
              },
              '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                backgroundColor: '#1A76D2 !important',
                color: 'white',
              },
            }}
          />
        </div>

        <Dialog open={openChequeDialog} onClose={resetChequeForm}>
          <DialogTitle>{editing ? 'Editar Cheque' : 'Nuevo Cheque'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="numero"
              label="Número"
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
          </DialogContent>
          <DialogActions>
            <Button onClick={resetChequeForm} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSaveCheque} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ marginTop: 30 }}>
          <h3>Total restante: {resta}</h3>
          <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default Cheques;