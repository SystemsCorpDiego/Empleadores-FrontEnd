import { useState, useEffect, useMemo, useContext } from 'react';
import { axiosPublicaciones, cargarImagen, tieneImagenCargada } from './PublicacionesApi';
import { EditarNuevaFila } from './PublicacionNueva';
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
  useGridApiRef,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import Swal from 'sweetalert2';
import './Publicaciones.css';

import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import formatter from '@/common/formatter';
import { UserContext } from '@/context/UserContext';
import { CloudUploadOutlined } from '@mui/icons-material';
import { CloudUploadTwoTone } from '@mui/icons-material';



export const Publicaciones = () => {
  const [locale, setLocale] = useState('esES');
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [imagenesCargadas, setImagenesCargadas] = useState({});


  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const gridApiRef = useGridApiRef();

  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      const response = await axiosPublicaciones.consultar();
      setRows(response);

      // Verificar si cada fila tiene una imagen cargada
      const imagenesEstado = {};
      for (const row of response) {
        imagenesEstado[row.id] = await tieneImagenCargada(row.id);
      }
      setImagenesCargadas(imagenesEstado);
    };
    obtenerPublicaciones();
  }, []);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (row) => async () => {
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
            const bBajaOk = await axiosPublicaciones.eliminar(row.id);
            if (bBajaOk) {
              setRows(rows.filter((reg) => reg.id !== row.id));
            } else {
              setRows(rows);
            }
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarFeriado:', error);
      }
    };
    showSwalConfirm();
  };

  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });

    const editedRow = rows.find((reg) => reg.id === row.id);
    if (!editedRow.id) {
      setRows(rows.filter((reg) => reg.id !== row.id));
    }
  };

  const handleImageUpload = async (row) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('archivo', file);

      await cargarImagen(formData, row.id);
      // Actualizar estado de imagen cargada después de la subida
      setImagenesCargadas((prev) => ({ ...prev, [row.id]: true }));
    };

    input.click();
  };


  const processRowUpdate = async (newRow, oldRow) => {
    let bOk = false;

    if (!newRow.id) {
      try {
        const data = await axiosPublicaciones.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
        }
        bOk = true;
        const newRows = rows.map((row) => (!row.id ? newRow : row));
        setRows(newRows);

        if (!(data && data.id)) {
          setTimeout(() => {
            setRowModesModel((oldModel) => ({
              [0]: { mode: GridRowModes.Edit, fieldToFocus: 'fecha' },
              ...oldModel,
            }));
          }, 100);
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - MODI - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      try {
        bOk = await axiosPublicaciones.actualizar(newRow);
        if (bOk) {
          const rowsNew = rows.map((row) =>
            row.id === newRow.id ? newRow : row,
          );
          setRows(rowsNew);
        }

        if (!bOk) {
          const indice = rows.indexOf(oldRow);
          console.log('rows.indexOf(oldRow) => indice: ', indice);
          setTimeout(() => {
            setRowModesModel((oldModel) => ({
              [indice]: { mode: GridRowModes.Edit, fieldToFocus: 'titulo' },
              ...oldModel,
            }));
          }, 100);
          return null;
        }
        bOk = true;
      } catch (error) {
        console.log(
          'X - processRowUpdate - MODI - ERROR: ' + JSON.stringify(error),
        );
      }
    }

    if (bOk) {
      return newRow;
    } else {
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('Error al actualizar la fila:', error);
  };

  const columns = [
    {
      field: 'titulo',
      headerName: 'Titulo',
      flex: 1,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'cuerpo',
      headerName: 'Cuerpo',
      flex: 1,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell header--cell--left',
    },
    {
      field: 'vigenciaDesde',
      headerName: 'Vigencia Desde',
      flex: 1,
      type: 'date',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell header--cell--left',
      valueGetter: ({ value }) => {
        return formatter.dateObject(value);
      },
      valueFormatter: ({ value }) => {
        return formatter.dateString(value);
      },
    },
    {
      field: 'vigenciaHasta',
      headerName: 'Vigencia Hasta',
      flex: 1,
      type: 'date',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell header--cell--left',
      valueGetter: ({ value }) => {
        return formatter.dateObject(value);
      },
      valueFormatter: ({ value }) => {
        return formatter.dateString(value);
      },
    },
    {
      field: 'imagen',
      headerName: 'Imagen',
      flex: 1,
      type: 'actions',
      headerAlign: 'center',
      headerClassName: 'header--cell header--cell-left',
      getActions: ({ row }) => {
        if (!row.id) return [];

        const imagenCargada = imagenesCargadas[row.id];
        if (imagenCargada) {
          return [
            <GridActionsCellItem
              icon={<CloudUploadTwoTone />}
              label="Imagen Cargada"
              onClick={() => handleImageUpload(row)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<CloudUploadOutlined />}
            label="Cargar Imagen"
            onClick={() => handleImageUpload(row)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      type: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell header--cell--left',
      getActions: ({ row }) => {
        const isInEditMode =
          rowModesModel[rows.indexOf(row)]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(row)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="publicaciones_container">
      <h1>Administración de Publicaciones</h1>
      <Box
        sx={{
          height: '600px',
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <ThemeProvider theme={themeWithLocale}>
          <StripedDataGrid
            apiRef={gridApiRef}
            rows={rows}
            columns={columns}
            editMode="row"
            getRowId={(row) => rows.indexOf(row)}
            getRowClassName={(params) =>
              rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
            }
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={(updatedRow, originalRow) =>
              processRowUpdate(updatedRow, originalRow)
            }
            onProcessRowUpdateError={(error, params) => {
              handleProcessRowUpdateError(error, params);
            }}
            localeText={dataGridStyle.toolbarText}
            slots={{
              toolbar: EditarNuevaFila,
            }}
            slotProps={{
              toolbar: {
                setRows,
                rows,
                setRowModesModel,
                volverPrimerPagina,
                showQuickFilter: true,
                showColumnMenu: true,
                themeWithLocale,
              },
            }}
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
              },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={pageSizeOptions}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};
