import { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { EditarNuevaFila } from './AporteNuevo';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';

import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import './Aportes.css';
import { axiosAportes, consultaCategoria, consultaEntidades } from './AportesApi';
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
  useGridApiRef,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import dayjs from 'dayjs';
import formatter from '@/common/formatter';

import { UserContext } from '@/context/userContext';

export const Aportes = () => {
  const [locale, setLocale] = useState('esES');
  const [categorias, setCategorias] = useState([]);
  
  const [camaras, setCamaras] = useState([]);
  const [rows, setRows] = useState([]);
  const [aportes, setAportes] = useState([])
  const [entidades, setEntidades] = useState(['UOMA','AMTIMA','OSPIM']);
  const [rowModesModel, setRowModesModel] = useState({});
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const gridApiRef = useGridApiRef();
  console.log(gridApiRef)
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    consultaAportesRows();
    getCategorias();
    getEntidades()
    console.log(categorias);
    console.log(camaras);
    console.log(entidades)
    console.log(aportes)
  }, []);

  useEffect(() => console.log(camaras), [camaras]); //sacar

  const consultaAportesRows = async () => {
    const response = await axiosAportes.consultar();
    setRows(response);
  };

  const getEntidades = async () => {
    const response = await consultaEntidades();
    const entidades = [...new Set(response.map(item => item.entidad))]

    setEntidades(entidades)
    setAportes(response)
  }

  const getCategorias = async () => {
    const response = await consultaCategoria();
    const camaras = [...new Set(response.map((item) => item.camara))];
    //camaras.push(null)
    camaras.push('');
    setCamaras(camaras);
    setCategorias(response);
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
            const bBajaOk = await axiosAportes.eliminar(row.id);
            if (bBajaOk) {
              setRows(rows.filter((reg) => reg.id !== row.id));
            } else {
              setRows(rows);
            }
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminar:', error);
      }
    };
    showSwalConfirm();
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
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

  const processRowUpdate = async (newRow, oldRow) => {
    let bOk = false;
    console.log(`estoy entrando`);
    if (!newRow.id) {
      try {
        const data = await axiosAportes.crear(newRow);
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
        bOk = await axiosAportes.actualizar(newRow);
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

  const handleProcessRowUpdateError = (error) => {
    console.error('Error al actualizar la fila:', error);
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      flex: 1,
      cellClassName: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
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
    {
      field: 'entidad',
      headerName: 'Entidad',
      type: 'singleSelect',
      valueOptions: entidades,
      flex: 1,
      headerAlign: 'left',
      editable: true,
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'aporte',
      headerName: 'Aporte',
      type: 'singleSelect',
      valueOptions: (params) => {
        if (aportes) {
          const filteredCategories = aportes
            .filter((item) => item?.entidad === params.row?.entidad)
            .map((item) => item.codigo);
          filteredCategories.push('');
          return [...new Set(filteredCategories)];
        }
        return [];
      },
      valueGetter: (params) => params.row.aporte || '',
      editable: true,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'socio',
      headerName: 'Socio',
      type: 'singleSelect',
      valueOptions: [
        { value: true, label: 'Si' },
        { value: false, label: 'No' },
      ],
      editable: true,
      flex: 1,
      headerAlign: 'left',
      headerClassName: 'header--cell',
      align: 'left',
      valueFormatter: ({ value }) => {
        return value ? 'Si' : 'No';
      },
    },
    {
      field: 'calculoTipo',
      headerName: 'Cálculo Tipo',
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'PO', label: 'Porcentaje' },
        { value: 'EN', label: 'Entero' },
      ],
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'calculoValor',
      headerName: 'Cálculo Valor',
      editable: true,
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return formatter.currency.format(value || 0);
      },
    },
    {
      field: 'calculoBase',
      headerName: 'Cálculo Base',
      flex: 1,
      editable: true,
      headerAlign: 'left',
      type: 'singleSelect',
      align: 'left',
      headerClassName: 'header--cell',
      valueOptions: [
        { value: 'PJ', label: 'Paritaria Jornal' },
        { value: 'PS', label: 'Paritaria Salarial' },
        { value: 'RE', label: 'Remunerativo' },
        { value: '', label: '' },

      ],
    },
    {
      field: 'camara',
      headerName: 'Cámara',
      flex: 1,
      type: 'singleSelect',
      valueOptions: camaras,
      editable: true,
      headerAlign: 'left',
      valueGetter: (params) => params.row.camara || '',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'camaraCategoria',
      headerName: 'Categoría',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: (params) => {
        if (categorias) {
          const filteredCategories = categorias
            .filter((item) => item?.camara === params.row?.camara)
            .map((item) => item.categoria);
          filteredCategories.push('');
          return [...new Set(filteredCategories)];
        }
        return [];
      },
      valueGetter: (params) => params.row.camaraCategoria || 'A',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'antiguedad',
      headerName: 'Antigüedad',
      flex: 1,
      editable: true,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'desde',
      headerName: 'Desde',
      flex: 1,
      editable: true,
      type: 'date',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueFormatter: (params) => {
        return formatter.dateString(params.value);
      },
    },
    {
      field: 'hasta',
      headerName: 'Hasta',
      editable: true,
      flex: 1,
      type: 'date',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueFormatter: (params) => {
        return formatter.dateString(params.value);
      },
    },
  ];

  return (
    <div className="publicaciones_container">
      <h1>Aportes</h1>
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
            //getRowId={(row) => row.id}
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
                gridApiRef
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
