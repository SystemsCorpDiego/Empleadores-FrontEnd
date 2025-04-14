import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { consultar } from './CuotasApi';
import Cheques from '../cheques/cheques';

export const Cuotas = () => {
  const [cuotas, setCuotas] = useState([]);
  const [cuota, setCuota] = useState({})
  const [numeroConvenio, setNumeroConvenio] = useState(1); // Cambia esto según tu lógica
  const [open, setOpen] = useState(false);
  

  useEffect(() => {
    const pathParts = window.location.href.split('/');
    const convenioFromPath = pathParts[pathParts.length - 2];
    setNumeroConvenio(convenioFromPath);
    const getCheques = async () => {
      await consultar(numeroConvenio)
        .then((response) => {
          setCuotas(response);
        })
        .catch((error) => {
          console.error('Error al consultar las cuotas:', error);
        });
    };
    getCheques();
    console.log(cuotas);
  }, [numeroConvenio]);

  const handleChequesClick = (cuotaId) => {
    // Lógica para acceder al componente de cheques
    console.log(`Accediendo a cheques de la cuota con ID: ${cuotaId}`);
  };

  const handleOpen = (row) => {
    console.log(row);
    setCuota(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'nro_cuota', headerName: 'Nro. Cuota', flex: 1 },
    { field: 'importeCuota', headerName: 'Importe Cuota', flex: 1 },
    { field: 'cheques', headerName: 'Nro. Cheques', flex: 1 },
    { field: 'totalCheques', headerName: 'Total Cheques', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          //onClick={() => handleChequesClick(params.row.id)}
          onClick={() => handleOpen(params.row)}
        >
          Ver Cheques
        </Button>
      ),
    },
  ];

  return (
    <div className="convenios_container">
      <h1 className="mt-1em">Cuotas convenio Nro {numeroConvenio}</h1>
      <Box sx={{ height: 450, width: '100%' }}>
        <Cheques
          open={open}
          handleClose={handleClose}
          convenio={cuota.convenioId}
          cuota={cuota.nro_cuota}
          //cheques={chequesPorFila[filaSeleccionada] || []}
          //setCheques={actualizarCheques}
          total={cuota.importeCuota}
        />
        <DataGrid
          rows={cuotas || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
};
