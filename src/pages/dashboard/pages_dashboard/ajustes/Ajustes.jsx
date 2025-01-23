import * as locales from '@mui/material/locale';
import { useState, useEffect, useMemo, useContext } from 'react';
import { TextField, Box, Button } from '@mui/material';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  useGridApiRef,
} from '@mui/x-data-grid';
import { axiosAjustes } from './AjustesApi';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import './ajustes.css';
import formatter from '@/common/formatter';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import { InputPeriodo } from '@/components/InputPeriodo';
import Swal from 'sweetalert2';
import { consultarEmpresa } from '@/common/api/EmpresasApi';

import { UserContext } from '@/context/userContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
};
const isNotNull = (value) => (value !== null && value !== '' ? value : '');
// Traerme las etiquetas del dom que tengas la clase .MuiDataGrid-cell--editable

const MOTIVOS = [
  { codigo: 'DI', descripcion: 'Devolución de Intereses' },
  { codigo: 'DPD', descripcion: 'Devolución por pago duplicado' },
  { codigo: 'O', descripcion: 'Otros' },
];


const handleClearFilters = (apiRef) => {
  apiRef.current.setFilterModel({ items: [] });
};

const crearNuevoRegistro = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
    gridApiRef
  } = props;
  
  const altaHandleClick = () => {
    //borro los filtros para que no genere un error
    handleClearFilters(gridApiRef)
  //Validar si hay un registro en Edicion
    try{
      if (rows) {
        const editRow = rows.find((row) => !row.id);
        if (typeof editRow === 'undefined' || editRow.id) {
          //console.log(editRow.id)
          const newReg =     {
            //"id": rows.indexOf(editRow),
            "cuit": "",
            "razonSocial": "",
            //"periodo_original": "2024-06-01",
            "periodo_original": "",
            "importe": 0.00,
            "aporte": "ART46",
            "motivo": "O",
            "vigencia": "",
            "boleta": null
        };
          //newReg.id = Date.now()
          console.log(newReg)
          volverPrimerPagina();
  
          setRows((oldRows) => [newReg, ...oldRows]);
          //console.log(rows)
          //console.log(oldModel)
          setRowModesModel((oldModel) => ({
            [0]: { mode: GridRowModes.Edit},//, fieldToFocus: 'name' },
            ...oldModel,
          }));
          //setRowModesModel((oldModel) => console.log(oldModel))
        }
      }
    } catch(e) {
      console.log(error)
    }

  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const Ajustes = () => {
  const gridApiRef = useGridApiRef();

  console.log(gridApiRef)
  const [locale, setLocale] = useState('esES');
  const [rows, setRows] = useState([]);
  const [aportes, setAportes] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const ConsultarEntidad = async () => {
    const data = await axiosAjustes.consultar();
    setRows(data);
  };

  const ConsultarAportes = async () => {
    const data = await axiosAjustes.consultarAportes();
    setAportes(data);
  };

  useEffect(() => {
    ConsultarEntidad();
    ConsultarAportes();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row) => () => {
    console.log('handleEditClick - row:');
    console.log(row);
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
            const bBajaOk = await axiosAjustes.eliminar(row.id);
            if (bBajaOk) setRows(rows.filter((rowAux) => rowAux.id !== row.id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarAjuste:', error);
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

  const processRowUpdate = async (newRow, oldRow) => {
    let bOk = false;
    console.log('processRowUpdate - newRow:', newRow);
    if (!newRow.id) {
      try {
        const newRowCast = { ...newRow };
        newRowCast.importe = parseFloat(String(newRowCast.importe).replace(',', '.'))
         //parseInt(newRowCast.importe) >= 0
          //  ? parseFloat(String(newRowCast.importe).replace(',', '.'))
          //  : null;

        console.log('processRowUpdate - newRowCast  :', newRowCast);
        const data = await axiosAjustes.crear(newRowCast);
        if (data && data.id) {
          newRow.id = data.id;
        }
        bOk = true;
        const newRows = rows.map((row) => (!row.id ? newRow : row));
        setRows(newRows);
        if (!(data && data.id)) {
          setTimeout(() => {
            setRowModesModel((oldModel) => ({
              [0]: { mode: GridRowModes.Edit },
              ...oldModel,
            }));
          }, 100);
        }
      } catch (error) {
        console.log(
          'X - processRowUpdate - ALTA - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      try {
        const newRowCast = { ...newRow };
        newRowCast.importe = parseFloat(String(newRowCast.importe).replace(',', '.'))
          //parseInt(newRowCast.importe) >= 0
          //  ? parseFloat(String(newRowCast.importe).replace(',', '.'))
          //  : null;

        console.log('processRowUpdate - newRowCast  :', newRowCast);

        bOk = await axiosAjustes.actualizar(newRowCast);
        if (bOk) {
          const rowsNew = rows.map((row) =>
            row.id === newRow.id ? newRow : row,
          );
          setRows(rowsNew);
        }
        if (!bOk) {
          const indice = rows.indexOf(oldRow);
          setTimeout(() => {
            setRowModesModel((oldModel) => ({
              [indice]: { mode: GridRowModes.Edit },
              ...oldModel,
            }));
          }, 100);
          return null;
        }
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

  const obtenerEmpresa = async (id, cuit) => {
    //console.log('obtenerEmpresa- cuit:', cuit);
    //console.log('obtenerEmpresa- id:', id);

    let razonSocial = '';
    const vecEmpre = await consultarEmpresa(cuit);
    console.log('obtenerEmpresa- vecEmpre:', vecEmpre);
    if (
      vecEmpre &&
      vecEmpre.length &&
      vecEmpre.length > 0 &&
      vecEmpre[0].razonSocial
    ) {
      //console.log('ENTROOO');
      razonSocial = vecEmpre[0].razonSocial;
    } else {
      gridApiRef.current.setEditCellValue({
        id: id,
        field: 'cuit',
        value: '',
      });
    }
    //console.log('obtenerEmpresa- razonSocial:', razonSocial);

    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'razonSocial',
      value: razonSocial,
    });
  };

  const columnas = [
    {
      field: 'cuit',
      headerName: 'CUIT',
      flex: 1,
      type: 'text',
      editable: true,
      headerAlign: 'center',
      align: 'right',
      headerClassName: 'header--cell',

      //obtenerEmpresa = async (id, cuit)
      renderEditCell: (params) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id={params.row.id ? 'cuit' + params.row.id.toString() : ''}
              fullWidth
              value={params.value || ''}
              onBlur={(event) => {
                obtenerEmpresa(params.id, params.value);
              }}
              onChange={(event) => {
                const newValue = event.target.value;

                params.api.setEditCellValue({
                  id: params.id,
                  field: 'cuit',
                  value: newValue,
                });
              }}
              onFocus={(event) => {
                const cuitActual = params.api.getCellValue(params.id, 'cuit');
                console.log('onFocus - cuitActual:', cuitActual);
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
          </div>
        );
      },
    },
    {
      field: 'razonSocial',
      headerName: 'RAZÓN SOCIAL',
      flex: 1,
      type: 'text',
      editable: true,
      headerAlign: 'center',
      align: 'right',
      headerClassName: 'header--cell',
    },
    {
      field: 'periodo_original',
      headerName: 'PERÍODO ORIGINAL',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'right',
      valueFormatter: (params) => {
        return isNotNull(params.value) ? formatter.periodo(params.value) : '';
      },
      renderEditCell: (params) => <InputPeriodo {...params} />,
      headerClassName: 'header--cell',
    },
    {
      field: 'importe',
      type: 'string',
      headerName: 'IMPORTE',
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        //console.log(' ', value);
        const formattedValue = formatValue({
          value: value?.toString(),
          groupSeparator: '.',
          decimalSeparator: ',',
          decimalScale: 2,
        });
        return formattedValue;
      },
      renderEditCell: (params) => {
        //console.log('renderEditCell-params: ', params);
        return (
          <CurrencyInput
            id={params.row.id ? 'importe' + params.row.id.toString() : ''}
            className="input-currency"
            decimalScale={2}
            decimalSeparator=","
            groupSeparator="."
            value={params.value || ''}
            onValueChange={(value, name, values) => {
              console.log('onValueChange - values:', values);
              params.api.setEditCellValue({
                id: params.id,
                field: 'importe',
                value: values.value,
              });
            }}
          />
        );
      },
    },
    {
      field: 'motivo',
      headerName: 'MOTIVO',
      flex: 1,
      type: 'singleSelect',
      editable: true,
      valueOptions: MOTIVOS.map((motivo) => ({
        label: motivo.descripcion,
        value: motivo.codigo,
      })),
      valueGetter: (params) => params.row.motivo || null,
      valueFormatter: (params) => {
        const motivo = MOTIVOS.find((motivo) => motivo.codigo === params.value);
        return motivo ? motivo.descripcion : '';
      },
      headerAlign: 'center',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'aporte',
      headerName: 'TIPO APORTE',
      type: 'singleSelect',
      editable: true,
      flex: 1,
      //valueOptions: () => aportes.map((aporte) => aporte.codigo),
      valueOptions: aportes.map((item) => {
        return { value: item.codigo, label: item.descripcion };
      }),
      valueGetter: (params) => params.row.aporte || null,
      headerAlign: 'center',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'vigencia',
      headerName: 'VIGENTE DESDE',
      width: 200,
      flex: 1,
      editable: true,
      headerAlign: 'center',
      align: 'right',
      type: 'date',
      valueFormatter: (params) => {
        return formatter.periodoString(params.value);
      },
      renderEditCell: (params) => <InputPeriodo {...params} />,
      headerClassName: 'header--cell',
    },
    {
      field: 'boleta',
      headerName: 'NRO BOLETA',
      width: 100,
      editable: false,
      type: 'number',
      headerAlign: 'center',
      align: 'right',
      headerClassName: 'header--cell',
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
        const isInEditMode =
          rowModesModel[rows.indexOf(row)]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(row)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              className="textPrimary"
              onClick={handleCancelClick(row)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            className="textPrimary"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="ajustes_container">
      <h1
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Administración de Ajustes
      </h1>

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
            columns={columnas}
            getRowId={(row) => rows.indexOf(row)}
            getRowClassName={(params) =>
              rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
            }
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={(updatedRow, originalRow) =>
              processRowUpdate(updatedRow, originalRow)
            }
            localeText={dataGridStyle.toolbarText}
            slots={{ toolbar: crearNuevoRegistro }}
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
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={pageSizeOptions}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
};
