import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { consultar } from './CuotasApi';

export const Cuotas = ({ numeroConvenio }) => {
  const [cuotas, setCuotas] = useState([]);

  useEffect(() => {
    consultar(numeroConvenio)
      .then((response) => {
        setCuotas(response.data);
      })
      .catch((error) => {
        console.error('Error al consultar las cuotas:', error);
      });
  }, [numeroConvenio]);

  const handleChequesClick = (cuotaId) => {
    // Lógica para acceder al componente de cheques
    console.log(`Accediendo a cheques de la cuota con ID: ${cuotaId}`);
  };

  const columns = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'nroCuota', headerName: 'Nro. Cuota', flex: 1 },
    { field: 'importeCuota', headerName: 'Importe Cuota', flex: 1 },
    { field: 'cheques', headerName: 'Cheques', flex: 1 },
    { field: 'totalCheques', headerName: 'Total Cheques', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleChequesClick(params.row.id)}
        >
          Ver Cheques
        </Button>
      ),
    },
  ];

  return (
    <div className="convenios_container">
      <h1 className="mt-1em">`Cuotas convenio Nro `</h1>
      <Box sx={{ height: 450, width: '100%' }}>
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


