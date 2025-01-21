import React, { useContext, useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import './ajustes.css';
import { getAjustes } from './AjustesApi';
import { UserContext } from '@/context/UserContext';

export const Ajustes = () => {
  const [ajustes, setAjustes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [ajustesAux, setAjustesAux] = useState([]);
  const [nuevoAjuste, setNuevoAjuste] = useState(null);

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const columns = [
    {
      field: 'cuit',
      headerName: 'CUIT',
      width: 130,
      editable: (params) => editando === params.id,
      renderCell: (params) =>
        editando === params.id ? (
          <TextField
            type="text"
            defaultValue={params.value}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'periodo_original',
      headerName: 'PERIODO ORIGINAL',
      width: 200,
      editable: (params) => editando === params.id,
      renderCell: (params) =>
        editando === params.id ? (
          <TextField
            type="month"
            defaultValue={params.value}
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled={editando !== params.id}
            onChange={(e) => HandleValues(params, e.target.value)}
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'importe',
      headerName: 'IMPORTE',
      width: 150,
      editable: (params) => editando === params.id,
      renderCell: (params) =>
        editando === params.id ? (
          <TextField
            type="number"
            defaultValue={params.value}
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled={editando !== params.id}
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'aporte',
      headerName: 'TIPO APORTE',
      width: 150,
      editable: (params) => editando === params.id,
      renderCell: (params) =>
        editando === params.id ? (
          <Select
            value={params.value}
            onChange={(e) => HandleValues(params, e.target.value)}
            size="small"
            disabled={editando !== params.id}
          >
            <MenuItem value="ART.46">ART.46</MenuItem>
            <MenuItem value="AMTIMA">AMTIMA</MenuItem>
            <MenuItem value="UOMA">UOMA</MenuItem>
          </Select>
        ) : (
          params.value
        ),
    },
    {
      field: 'vigencia',
      headerName: 'VIGENTE DESDE',
      width: 200,
      editable: (params) => editando === params.id,
      renderCell: (params) =>
        editando === params.id ? (
          <TextField
            type="month"
            defaultValue={params.value}
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled={editando !== params.id}
            onChange={(e) => HandleValues(params, e.target.value)}
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'nro_boleta',
      headerName: 'NRO BOLETA',
      width: 150,
      editable: false,
    },
    {
      field: 'acciones',
      headerName: 'ACCIONES',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="outlined"
            size="small"
            disabled={params.row.nro_boleta ? true : false}
            onClick={() => handleSetEditando(params.id)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => console.log(params.row)}
          >
            Guardar
          </Button>
        </div>
      ),
    },
  ];

  const HandleValues = (params, value) => {
    onChangeValue({ ...params, value });
  };

  const onChangeValue = (params) => {
    const rowIndex = ajustes.findIndex((row) => row.id === params.row.id);
    const newAjustes = [...ajustes];
    newAjustes[rowIndex] = {
      ...newAjustes[rowIndex],
      [params.field]: params.value,
    };
    setAjustes(newAjustes);
    console.log('Valores modificados:', params.row);
  };

  const handleSetEditando = (id) => {
    if (editando == null && id === 'nuevo') {
      console.log('algo');
    }
    if (editando == null && id !== 'nuevo') {
      const rowIndex = ajustes.findIndex((row) => row.id === id);
      setEditando(id);
      setAjustesAux(ajustes[rowIndex]);
    } else {
      const rowIndex = ajustes.findIndex((row) => row.id === ajustesAux.id);
      const newAjustes = [...ajustes];
      newAjustes[rowIndex] = { ...ajustesAux };
      setAjustes([...newAjustes]);
      setEditando(null);
    }
  };

  const handleNuevoAjuste = () => {
    console.log('agregando nuevo registro');
    const newAjustes = [...ajustes];
    const nuevoIndex = newAjustes.length + 1;
    newAjustes.push({ id: nuevoIndex });
    setAjustes(newAjustes);
    setEditando('nuevo');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAjustes();
        setAjustes(response);
      } catch (error) {
        console.error('Error al obtener ajustes:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      className="ajustes_container"
      style={{ height: 400, width: '100%' }}
      sx={{
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#1A76D2',
          color: 'white',
        },
      }}
    >
      <h1>Ajustes</h1>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={ajustes}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
          onEditCellChangeCommitted={onChangeValue}
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
                <Button
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleNuevoAjuste}
                  style={{ fontSize: '0.8125rem' }}
                >
                  Nuevo Registro
                </Button>
              </GridToolbarContainer>
            ),
          }}
          localeText={{
            toolbarColumns: 'Columnas',
            toolbarFilters: 'Filtros',
            toolbarExport: 'Exportar',
          }}
        />
      </div>
    </Box>
  );
};
