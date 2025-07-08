import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { consultar } from './CuotasApi';
import Cheques from '../cheques/cheques';
import formatter from '@/common/formatter';
import localStorageService from '@/components/localStorage/localStorageService';


export const Cuotas = () => {
  const navigate = useNavigate();
  const [cuotas, setCuotas] = useState([]);
  const [cuota, setCuota] = useState(null)
  const [numeroConvenio, setNumeroConvenio] = useState(null); 
  
  const [open, setOpen] = useState(false);
  const ID_EMPRESA = localStorageService.getEmpresaId();

useEffect(() => {
  const pathParts = window.location.href.split('/');
  const convenioFromPath = pathParts[pathParts.length - 2];
  
  setNumeroConvenio(convenioFromPath);
}, []);

useEffect(() => {

  const getCuotas = async () => {
    console.log(numeroConvenio, ID_EMPRESA);
    await consultar(numeroConvenio, ID_EMPRESA)
      .then((response) => {
        console.log('Cuotas response:', response);
        setCuotas(response);
      })
      .catch((error) => {
        console.error('Error al consultar las cuotas:', error);
      });
  };
  if (!numeroConvenio) return;
  if (ID_EMPRESA === null) return;
  getCuotas();
}, [numeroConvenio]);

  

  const handleOpen = (row) => {
    console.log(row);
    setCuota(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'numero', headerName: 'Nro. Cuota', flex: 1 },
    { field: 'importe', headerName: 'Importe Cuota', align: 'right', flex: 1, valueFormatter: (params) => formatter.currency.format(params.value || 0) },
    { field: 'chequesNro', headerName: 'Nro. Cheques', flex: 1 },
    { field: 'chequesTotal', headerName: 'Total Cheques', align: 'right', flex: 1,valueFormatter: (params) => formatter.currency.format(params.value || 0) },
    { field: 'vencimiento', headerName: 'Fecha Vencimiento', flex: 1 },
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
        {cuota && (
          <Cheques
            open={open}
            handleClose={handleClose}
            convenio={numeroConvenio}
            cuota={cuota.numero}
            cuotaId={cuota.id}
            //cheques={chequesPorFila[filaSeleccionada] || []}
            //setCheques={actualizarCheques}
            total={cuota.importe}
          />
        )}
        <DataGrid
          rows={cuotas || []}
          columns={columns}
          getRowClassName={(params) =>
            cuotas.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
          }
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
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '1em' }}
        onClick={() => navigate('/dashboard/convenios')}
      >
        Mis convenios
      </Button>
    </div>
  );
};
