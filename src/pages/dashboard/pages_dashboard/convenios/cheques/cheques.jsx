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
import localStorageService from '@/components/localStorage/localStorageService';
import Swal from 'sweetalert2';
import './cheques.css'
import { esES } from '@mui/x-data-grid';

const Cheques = ({ open, handleClose, convenio, cuota, cuotaId, total, getCuotas }) => {
  const ID_EMPRESA = localStorageService.getEmpresaId();

  const [cheques, setCheques] = useState([]);
  const [openChequeDialog, setOpenChequeDialog] = useState(false);
  const [resta, setResta] = useState(total);
  const [editing, setEditing] = useState(false);
  const [rol, setRol] = useState(localStorageService.getRol());
  const [newCheque, setNewCheque] = useState({
    fecha: '',
    id: 0,
    numero: '',
    importe: '',
    estado: 'INGRESADO', // Estado por defecto
  });

  // Cargar cheques al abrir
  useEffect(() => {
    console.log('Rol actual:', rol);
    console.log('OSPIM_EMPLEADO' === rol);
    console.log('Cargando cheques para convenio:', convenio, 'cuota:', cuotaId, 'ID Empresa:', ID_EMPRESA);
    if (!convenio || !cuotaId || !ID_EMPRESA) {
      console.warn('Valores insuficientes para consultar cheques', { convenio, cuotaId, ID_EMPRESA });
      return;
    }

    const fetchCheques = async () => {
      const response = await axiosCheques.consultar(convenio, cuotaId, ID_EMPRESA);
      setCheques(response);
    };

    fetchCheques();
  }, [convenio, cuota, ID_EMPRESA]);

  // Calcular resta automáticamente
  useEffect(() => {
    const totalCheques = cheques.reduce((sum, item) => sum + Number(item.importe || 0), 0);
    setResta(total - totalCheques);
  }, [cheques, total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCheque({ ...newCheque, [name]: value });
  };

  const resetChequeForm = () => {
    setNewCheque({ fecha: '', id: 0, numero: '', importe: '' });
    setOpenChequeDialog(false);
    setEditing(false);
  };

  const handleSaveCheque = async () => {
    // Validación básica
    if (!newCheque.numero || !newCheque.fecha || !newCheque.importe) {
      //document.body.style.setProperty('z-index', '9999', 'important');
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos del cheque',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: true,
        customClass: {
          popup: 'custom-zindex-swal',
        },
        willOpen: (popup) => {
          popup.style.zIndex = '9999';
        },
      });
      //alert("Completa todos los campos del cheque");
      return;
    }

    if (newCheque.importe < 0) {
      //document.body.style.setProperty('z-index', '9999', 'important');
      await Swal.fire({
        icon: 'warning',
        title: 'Monto negativo',
        text: 'El monto del cheque no puede ser negativo',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: true,
        customClass: {
          popup: 'custom-zindex-swal',
        },
        willOpen: (popup) => {
          popup.style.zIndex = '9999';
        },
      });
      //alert("Completa todos los campos del cheque");
      return;
    }

    try {
      if (editing) {
        await axiosCheques.actualizar({
          numero: newCheque.numero,
          fecha: newCheque.fecha,
          importe: parseFloat(newCheque.importe.replace(",", ".")),
          estado: newCheque.estado || 'CARGADO', // Asegurarse de que estado tenga un valor por defecto
        },
          ID_EMPRESA,
          convenio,
          cuotaId,
          newCheque.id
        );
      } else {
        await axiosCheques.crear(
          {
            numero: newCheque.numero,
            fecha: newCheque.fecha,
            importe: parseFloat(newCheque.importe.replace(",", ".")), // Asegurarse de que importe sea un número con dos decimales
            estado: 'INGRESADO',
          },
          cuotaId,
          convenio,
          ID_EMPRESA
        );
      }

      resetChequeForm();

      // Refrescar cheques
      const updated = await axiosCheques.consultar(convenio, cuotaId, ID_EMPRESA);      
      setCheques(updated);
      getCuotas()
    } catch (error) {
      console.error('Error al guardar el cheque', error);
    }
  };

  const handleEditCheque = (id) => {
    const cheque = cheques.find((c) => c.id === id);
    if (!cheque) return;
    setNewCheque({
      ...cheque,
      importe: cheque.importe?.toString() || '',
    });
    setEditing(true);
    setOpenChequeDialog(true);
  };

  const handleDeleteCheque = async (row) => {
    try {
      console.log('Eliminando cheque:', row);
      console.log('Convenio:', convenio, 'Cuota:', cuotaId, 'ID Empresa:', ID_EMPRESA);
      await axiosCheques.eliminar(ID_EMPRESA, convenio, cuotaId, row.id);
      const updated = await axiosCheques.consultar(convenio, cuotaId, ID_EMPRESA);
      setCheques(updated);
    } catch (error) {
      console.error('Error al eliminar el cheque', error);
    }
  };

  const columns = [
    { field: 'fecha', headerName: 'Fecha', flex: 1, align: 'center' },
    {
      field: 'importe',
      headerName: 'Monto',
      flex: 1,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    { field: 'numero', headerName: 'Número Cheque', flex: 1, align: 'center' },
    { field: 'estado', headerName: 'Estado', flex: 1, align: 'center' },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditCheque(params.row.id)}>
            Editar
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: '5px' }}
            onClick={() => handleDeleteCheque(params.row)}
          >
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // Validar que la fecha sea mayor o igual a hoy
  const isFechaInvalida = !!newCheque.fecha && newCheque.fecha < todayStr;

  return (
    <Modal open={open} onClose={handleClose}>
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
            //localeText={esES.components.MuiDataGrid.defaultProps.localeText}
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
              name="fecha"
              label="Fecha"
              type="date"
              fullWidth
              value={newCheque.fecha || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: todayStr, lang: 'es' }}
              error={isFechaInvalida}
              helperText={isFechaInvalida ? 'La fecha no puede ser menor a hoy' : ''}
            />
            <TextField
              margin="dense"
              name="numero"
              label="Número"
              fullWidth
              value={newCheque.numero || ''}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="importe"
              label="Monto"
              type="number"
              fullWidth
              value={newCheque.importe || ''}
              onChange={handleInputChange}
            />

            {rol === 'OSPIM_EMPLEADO' && editing && (
              <TextField
                margin="dense"
                name="estado"
                label="Estado"
                select
                fullWidth
                value={newCheque.estado || ''}
                onChange={handleInputChange}
                disabled={localStorageService.isRolEmpleador()}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CARGADO">CARGADO</option>
                <option value="RECIBIDO">RECIBIDO</option>
                <option value="RECHAZADO">RECHAZADO</option>
              </TextField>
            )}
            
          </DialogContent>
          <DialogActions>
            <Button onClick={resetChequeForm} color="secondary">
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCheque}
              color="primary"
              disabled={isFechaInvalida}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ marginTop: 30 }}>
          <h3>Total restante: {formatter.currency.format(resta)}</h3>
          <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default Cheques;