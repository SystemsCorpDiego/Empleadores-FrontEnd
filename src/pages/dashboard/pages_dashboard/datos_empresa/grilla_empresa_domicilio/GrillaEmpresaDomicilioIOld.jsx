import { useState, useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { axiosDomicilio } from './GrillaEmpresaDomicilioApi';
import Swal from 'sweetalert2';

function EditToolbar(props) {
  const { setRows, rows, setRowModesModel, volverPrimerPagina } = props;

  const handleClick = () => {
    const maxId = rows ? Math.max(...rows.map((row) => row.id), 0) : 1;
    const newId = maxId + 1;
    const id = newId;

    volverPrimerPagina();

    setRows((oldRows) => [
      {
        id,
        tipo: '',
        provinciaId: '',
        localidadId: '',
        calle: '',
        piso: '',
        dpto: '',
        oficina: '',
        cp: '',
        planta: '',
        valor: '',
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
    </GridToolbarContainer>
  );
}

export const GrillaEmpresaDomicilio = ({ idEmpresa, rows, setRows }) => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [tipoDomicilio, setTipoDomicilio] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const getTipoDomicilio = async () => {
    const response = await axiosDomicilio.obtenerTipo();
    setTipoDomicilio(response.map((item) => ({ ...item })));
  };

  const getProvincias = async () => {
    const response = await axiosDomicilio.obtenerProvincias();
    setProvincias(response.map((item) => ({ ...item })));
  };

  const getLocalidades = async (provinciaId) => {
    if (provinciaId) {
      return await axiosDomicilio.obtenerLocalidades(provinciaId);
    } else {
      return [];
    }
  };

  const getRowsDomicilio = async () => {
    const response = await axiosDomicilio.obtenerDomicilios(idEmpresa);
    setRows(response.map((item) => ({ ...item })));
    getDatosLocalidad(response.map((item) => ({ ...item })));
  };

  const getDatosLocalidad = async (rowsDomicilio) => {
    const localidadesTemp = [];
    for (const reg of rowsDomicilio) {
      try {
        const vecRegProv = localidadesTemp.filter(
          (locTmp) => locTmp.provinciaId == reg.provinciaId,
        );

        if (vecRegProv.length == 0) {
          const localidad = await getLocalidades(reg.provinciaId);

          // Agregar el campo idProvincia a cada objeto de localidades
          const localidadesConIdProvincia = localidad.map((item) => ({
            provinciaId: reg.provinciaId,
            ...item,
          }));
          localidadesTemp.push(...localidadesConIdProvincia);
        }
      } catch (error) {
        console.error('** Error al obtener localidades:', error);
      }
    }
    setLocalidades(localidadesTemp);
  };

  const actualizarDatosLocalidad = async (provinciaId) => {
    const options = localidades.filter((item) => {
      return item.provinciaId == provinciaId;
    });
    console.log(options);
    if (options.length == 0) {
      const localidad = await getLocalidades(provinciaId);

      if (localidad) {
        const localidadesConIdProvincia = localidad.map((item) => ({
          provinciaId: provinciaId,
          ...item,
        }));
        localidadesConIdProvincia.push(...localidades);
        setLocalidades(localidadesConIdProvincia);
      }
    }
  };

  useEffect(() => {
    getProvincias();
    getTipoDomicilio();
    getRowsDomicilio();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const bBajaOk = await axiosDomicilio.eliminar(idEmpresa, id);
            if (bBajaOk) setRows(rows.filter((row) => row.id !== id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarDomicilio:', error);
      }
    };

    showSwalConfirm();
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow, oldRow) => {
    let bOk = false;
    if (newRow.isNew) {
      try {
        delete newRow.id;
        delete newRow.isNew;
        const data = await axiosDomicilio.crear(idEmpresa, newRow);
        if (data && data.id) {
          newRow.id = data.id;
          newRow.isNew = false;
          bOk = true;
          const newRows = rows.map((row) => (row.isNew ? newRow : row));
          setRows(newRows);
        } else {
          console.log('alta sin ID generado');
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - ALTA - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      try {
        delete newRow.isNew;
        bOk = await axiosDomicilio.actualizar(idEmpresa, newRow);
        console.log('4 - processRowUpdate - MODI - bOk: ' + bOk);
        newRow.isNew = false;
        if (bOk) {
          setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - MODI - ERROR: ' + JSON.stringify(error),
        );
      }
    }

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    if (bOk) {
      return newRow;
    } else {
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleCellEditStart = (params, event, details) => {
    // Realiza acciones personalizadas cuando comienza la edición de una celda
    console.log('Cell edit started:', params, event, details);
  };

  const columns = [
    {
      field: 'tipo',
      headerName: 'Tipo',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getOptionValue: (dato) => dato.codigo,
      getOptionLabel: (dato) => dato.descripcion,
      valueOptions: tipoDomicilio,
    },
    {
      field: 'provinciaId',
      headerName: 'Provincia',
      flex: 2,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: provincias,
      getOptionValue: (dato) => dato.id,
      getOptionLabel: (dato) => dato.descripcion,
      renderEditCell: (params) => {
        actualizarDatosLocalidad(params.value);
        return (
          <Select
            value={params.value}
            onChange={(e) => {
              // Limpiar el valor de la localidad
              params.api.setEditCellValue({
                id: params.id,
                field: 'localidadId',
                value: '',
              });
              params.api.setEditCellValue(
                {
                  id: params.id,
                  field: 'provinciaId',
                  value: e.target.value,
                },
                e.target.value,
              );

              console.log('params:', params);
              console.log(params.row.localidadId);
              params.row.localidadId = '';
            }}
            sx={{ width: 200 }}
          >
            {provincias.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.descripcion}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'localidadId',
      headerName: 'Localidad',
      flex: 2,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      //valueOptions: localidadesList,
      valueOptions: ({ row }) => {
        var options = localidades.filter((item) => {
          return item.provinciaId == row.provinciaId;
        });
        return options;
      },
      getOptionValue: (dato) => dato.id,
      getOptionLabel: (dato) => dato.descripcion,
      renderEditCell: (params) => {
        // limpiar el campo localidadId cuando se cambia la provincia
        var datos = localidades.filter((item) => {
          return item.provinciaId == params.row.provinciaId;
        });
        return (
          <Select
            value={params.value}
            onChange={(e) => {
              params.api.setEditCellValue(
                {
                  id: params.id,
                  field: 'localidadId',
                  value: e.target.value,
                },
                e.target.value,
              );
            }}
            sx={{ width: 220 }}
          >
            {datos.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.descripcion}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'calle',
      headerName: 'Calle',
      flex: 2,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'piso',
      headerName: 'Piso',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'depto',
      headerName: 'Depto',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'oficina',
      headerName: 'Oficina',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'cp',
      headerName: 'CP',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'planta',
      headerName: 'Planta',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: '600px',
        width: '100%',
        overflowX: 'scroll',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        onCellEditStart={handleCellEditStart}
        processRowUpdate={(updatedRow, originalRow) =>
          processRowUpdate(updatedRow, originalRow)
        }
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: {
            setRows,
            rows_domicilio: rows,
            setRowModesModel,
            volverPrimerPagina,
          },
        }}
        sx={{
          // ...
          '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
            width: '8px',
            visibility: 'visible',
          },
          '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
          },
        }}
        localeText={{
          noRowsLabel: '',
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 15, 25]}
      />
    </Box>
  );
};
