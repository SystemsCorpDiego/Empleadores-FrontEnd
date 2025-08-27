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
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

export const Aportes = () => {
  const [locale, setLocale] = useState('esES');
  const [categorias, setCategorias] = useState([]);

  const [camaras, setCamaras] = useState([]);
  const [rows, setRows] = useState([]);
  const [aportes, setAportes] = useState([])
  const [entidades, setEntidades] = useState(['UOMA', 'AMTIMA', 'OSPIM', '']);
  const [rowModesModel, setRowModesModel] = useState({});
  const [edit, setEdit] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
    setRows(sanitizeRows(response));
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
    setIsEditing(true);
    const today = dayjs().format('YYYY-MM-DD');
    const desdeFormatted = row.desde ? dayjs(row.desde).format('YYYY-MM-DD') : null;
    console.log('today', today, 'desdeFormatted', desdeFormatted)

    const esMenor = dayjs(desdeFormatted).isBefore(dayjs(today), 'day');
    setEdit(!esMenor);

    setRowModesModel(prev => ({
      ...prev,
      [row.id]: { mode: GridRowModes.Edit, fieldToFocus: 'hasta' }
    }));
  };

  const handleSaveClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: { mode: GridRowModes.View },
    });
    setIsEditing(false);
  };

  const handleCancelClick = (row) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });

    const editedRow = rows.find((reg) => reg.id === row.id);
    if (!editedRow?.id || String(editedRow.id).startsWith('temp-')) {
      setRows(rows.filter((reg) => reg.id !== row.id));
    }
    setEdit(true);
    setIsEditing(false);
  };

  function sanitizeRows(rows) {
    return rows.map(row => ({
      ...row,
      entidad: row.entidad ?? '',
      aporte: row.aporte ?? '',
      socio: row.socio ?? false,
      calculoTipo: row.calculoTipo ?? '',
      calculoValor: row.calculoValor ?? '',
      calculoBase: row.calculoBase ?? '',
      camara: row.camara ?? '',
      camaraCategoria: row.camaraCategoria ?? '',
      camaraAntiguedad: row.camaraAntiguedad ?? '',
      desde: row.desde ?? '',
      hasta: row.hasta ?? '',
    }));
  }

  const processRowUpdate = async (newRow, oldRow) => {
    const fechaDesde = dayjs(newRow.desde);
    const fechaHasta = dayjs(newRow.hasta);

    if (fechaHasta.isBefore(fechaDesde)) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas inválidas',
        text: 'La fecha "Hasta" no puede ser anterior a la fecha "Desde".',
      });
      return oldRow;
    }

    let bOk = false;
    if (!newRow.id || String(newRow.id).startsWith('temp-')) {
      try {
        const data = await axiosAportes.crear(newRow);
        if (data && data.id) {
          newRow.id = data.id;
          const newRows = rows.map((row) =>
            String(row.id).startsWith('temp-') ? newRow : row
          );
          setRows(newRows);
          bOk = true;
        }
      } catch (error) {
        console.error('Error al crear:', error);
      }
    } else {
      try {
        bOk = await axiosAportes.actualizar(newRow);
        if (bOk) {
          const newRows = rows.map((row) =>
            row.id === newRow.id ? newRow : row
          );
          setRows(newRows);
        }
      } catch (error) {
        console.error('Error al actualizar:', error);
      }
    }

    return bOk ? newRow : oldRow;
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('Error al actualizar la fila:', error);
  };

  const columns = [

    {
      field: 'entidad',
      headerName: 'Entidad',
      type: 'singleSelect',
      valueOptions: () => {
        const ent = entidades.map(e => e ?? '');
        ent.push('TODAS');
        return ent
      },
      flex: 1,
      headerAlign: 'left',
      editable: edit,
      align: 'left',
      headerClassName: 'header--cell',
      valueGetter: (params) => params.row.entidad ?? 'TODAS',
    },
    {
      field: 'aporte',
      headerName: 'Aporte',
      type: 'singleSelect',
      valueOptions: (params) => {
        if (aportes) {
          const filtered = aportes.filter(item => item?.entidad === params.row?.entidad);
          const options = filtered.map(item => ({
            value: item.codigo,
            label: item.descripcion,
          }));
          options.push({ value: '', label: '' });
          return options;
        }
        return [{ value: '', label: '' }];
      },
      valueGetter: (params) => params.row.aporte ?? '',
      renderCell: (params) => {

        const found = aportes.find(
          a => a.codigo === params.value && a.entidad === params.row.entidad
        );
        return found ? found.descripcion : '';
      },
      editable: edit,
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
        { value: 'Todos', label: 'Todos' },
      ],
      valueGetter: (params) => params.row.socio ?? null,
      editable: edit,
      flex: 1,
      headerAlign: 'left',
      headerClassName: 'header--cell',
      align: 'left',

      valueFormatter: ({ value }) => {
        if (value === null) return 'Todos';
        return value === true ? 'Si' : 'No';
      },
    },
    {
      field: 'calculoTipo',
      headerName: 'Cálculo Tipo',
      editable: edit,
      type: 'singleSelect',
      valueOptions: [
        { value: 'PO', label: 'Porcentaje' },
        { value: 'EN', label: 'Entero' },
      ],
      valueGetter: (params) => {
        const value = params.row.calculoTipo;
        return value === undefined || value === null || value === '' ? 'PO' : value;
      },
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'calculoValor',
      headerName: 'Cálculo Valor',
      editable: edit,
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      headerClassName: 'header--cell',
      valueGetter: (params) => params.row.calculoValor ?? null,
      valueFormatter: ({ value }) => {
        if (value === '' || value === null) return '';
        //return formatter.currency.format(value || 0);
        return value ? value : 0
      },
    },
    {
      field: 'calculoBase',
      headerName: 'Cálculo Base',
      flex: 1,
      editable: edit,
      type: 'singleSelect',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueGetter: (params) => params.row.calculoBase ?? null,
      valueOptions: [
        { value: 'PJ', label: 'Paritaria Jornal' },
        { value: 'PS', label: 'Paritaria Salarial' },
        { value: 'RE', label: 'Remunerativo' },
        { value: null, label: 'Todos' },
      ],
    },
    {
      field: 'camara',
      headerName: 'Cámara',
      flex: 1,
      type: 'singleSelect',
      valueOptions: camaras,
      editable: edit,
      headerAlign: 'left',
      valueGetter: (params) => params.row.camara ?? null,
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'camaraCategoria',
      headerName: 'Categoría',
      flex: 1,
      editable: edit,
      type: 'singleSelect',
      valueOptions: (params) => {
        if (categorias) {
          const filtered = categorias
            .filter(item => item?.camara === params.row?.camara)
            .map(item => item.categoria);

          return [...new Set(filtered)];
        }
        return [null];
      },
      valueGetter: (params) => {
        const value = params.row.camaraCategoria;
        return value === null ? '' : value;
      },
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'camaraAntiguedad',
      headerName: 'Antigüedad',
      flex: 1,
      editable: edit,
      valueGetter: (params) => {
        const value = params.row.camaraAntiguedad;
        return value === "" || value === undefined || value === null || isNaN(value)
          ? null
          : Number(value);
      },
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'desde',
      headerName: 'Desde',
      flex: 1,
      type: 'date',
      headerAlign: 'left',
      editable: edit,
      align: 'left',
      headerClassName: 'header--cell',
      valueGetter: ({ value }) => (value ? formatter.dateObject(value) : null),
      valueFormatter: ({ value }) => (value ? formatter.dateString(value) : ''),
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
      valueGetter: ({ value }) => (value ? formatter.dateObject(value) : null),
      valueFormatter: ({ value }) => (value ? formatter.dateString(value) : ''),
    },
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
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;
        const today = dayjs().format('YYYY-MM-DD');
        const desdeFormatted = row.desde ? dayjs(row.desde).format('YYYY-MM-DD') : null;
        const allowDelete = desdeFormatted >= today;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
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
          !isEditing && (<GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />)
          ,
          allowDelete && (
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(row)}
              color="inherit"
            />
          ),
        ].filter(Boolean);
      },
    }
  ];

  return (
    <div className="publicaciones_container">
      <h1>Configuración Aportes</h1>
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
            getRowId={(row) => row.id}
            //getRowId={(row) => rows.indexOf(row)}
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
                gridApiRef,
                isEditing,
                setIsEditing : setIsEditing
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
