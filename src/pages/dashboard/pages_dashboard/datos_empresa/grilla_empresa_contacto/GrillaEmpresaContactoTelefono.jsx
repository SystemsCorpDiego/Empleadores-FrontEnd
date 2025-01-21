import { useState, useEffect, useContext, useMemo } from 'react';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridEditInputCell,
} from '@mui/x-data-grid';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { Button, Box, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { axiosContacto } from './GrillaEmpresaContactoApi';
import Swal from 'sweetalert2';
import { UserContext } from '@/context/UserContext';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import localStorageService from '@components/localStorage/localStorageService';

function EditToolbar(props) {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
  } = props;
  const crudHabi = localStorageService.funcionABMEmpresaHabilitada();

  const handleClick = () => {
    console.log(props);
    if (rows) {
      const editRow = rows.find((row) => !row.id);
      if (typeof editRow === 'undefined' || editRow.id) {
        const newReg = {
          tipo: '',
          prefijo: '',
          valor: '',
        };

        volverPrimerPagina();
        setRows((oldRows) => [newReg, ...oldRows]);
        setRowModesModel((oldModel) => ({
          [0]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
          ...oldModel,
        }));
      }
    }
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <h2 className="subtitulo">Teléfonos</h2>
      {crudHabi && (
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Nuevo Registro
        </Button>
      )}
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
}

export const GrillaEmpresaContactoTelefono = ({
  idEmpresa,
  rows,
  setRows,
  tipoContacto,
}) => {
  const crudHabi = localStorageService.funcionABMEmpresaHabilitada();
  const [lengthValor, setLengthValor] = useState(5);
  const [lengthPrefijo, setLengthPrefijo] = useState(5);
  const [locale, setLocale] = useState('esES');
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

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const initializeLengths = (row) => {
    console.log(row);
    const prefijoLength = row.prefijo ? row.prefijo.length : 0;
    const valorLength = row.valor ? row.valor.length : 0;
    setLengthPrefijo(10 - valorLength);
    setLengthValor(10 - prefijoLength);
  };

  const handleEditClickTelefono = (row) => () => {
    initializeLengths(row);
    setRowModesModel({
      ...rowModesModel,
      [rows.indexOf(row)]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClickTelefono = (row) => () => {
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
            const bBajaOk = await axiosContacto.eliminar(idEmpresa, row.id);
            if (bBajaOk) setRows(rows.filter((rowAux) => rowAux.id !== row.id));
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarContacto:', error);
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
    console.log(newRow);
    console.log(oldRow);
    let bOk = false;
    if (!newRow.id) {
      try {
        const data = await axiosContacto.crear(idEmpresa, newRow);
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
          'X - processRowUpdate - ALTA - ERROR: ' + JSON.stringify(error),
        );
      }
    } else {
      try {
        newRow.prefijo = newRow.prefijo ? newRow.prefijo : '';
        console.log(newRow);
        bOk = await axiosContacto.actualizar(idEmpresa, newRow);
        console.log('4 - processRowUpdate - MODI - bOk: ' + bOk);
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
              [indice]: { mode: GridRowModes.Edit, fieldToFocus: 'fecha' },
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

  const handlePrefijoChange = (params, event) => {
    const newPrefijoLength = event.target.value.length;
    const newLengthValor = 10 - newPrefijoLength;

    setLengthValor(newLengthValor);

    params.api.setEditCellValue({
      id: params.id,
      field: 'prefijo',
      value: event.target.value,
    });
  };

  const handleValorChange = (params, event) => {
    const newValorLength = event.target.value.length;

    const newLengthPrefijo = 10 - newValorLength;
    setLengthPrefijo(newLengthPrefijo);

    params.api.setEditCellValue({
      id: params.id,
      field: 'valor',
      value: event.target.value,
    });
  };

  const columnTelefono = [
    {
      field: 'tipo',
      headerName: 'Tipo de contacto',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: tipoContacto.map((item) => {
        return {
          value: item.codigo,
          label: item.descripcion,
        };
      }),
    },
    {
      field: 'prefijo',
      headerName: 'Prefijo',
      flex: 1,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderEditCell: (params) => (
        <TextField
          fullWidth
          value={params.value || ''}
          onChange={(event) => handlePrefijoChange(params, event)}
          inputProps={{
            pattern: '[0-9]*',
            //maxLength: lengthPrefijo,
          }}
        />
      ),
      headerClassName: 'header--cell',
    },
    {
      field: 'valor',
      headerName: 'Número',
      flex: 1,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderEditCell: (params) => (
        <TextField
          fullWidth
          value={params.value || ''}
          onChange={(event) => handleValorChange(params, event)}
          inputProps={{
            pattern: '[0-9]*',
            //maxLength: lengthValor,
          }}
        />
      ),
      headerClassName: 'header--cell',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      type: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ row }) => {
        const isInEditMode =
          rowModesModel[rows.indexOf(row)]?.mode === GridRowModes.Edit;
        console.log(crudHabi);
        if (!crudHabi) return [];

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClickTelefono(row)}
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
            onClick={handleEditClickTelefono(row)}
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
    <Box
      sx={{
        height: '350px',
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
      <ThemeProvider theme={themeWithLocale}>
        <StripedDataGrid
          rows={rows}
          columns={columnTelefono}
          getRowId={(row) => rows.indexOf(row)}
          getRowClassName={(params) =>
            rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
          }
          editMode="row"
          isCellEditable={() => crudHabi}
          disableColumnSelector
          disableSelectionOnClick
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={(updatedRow, originalRow) =>
            processRowUpdate(updatedRow, originalRow)
          }
          localeText={dataGridStyle.toolbarText}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              setRows,
              rows,
              setRowModesModel,
              volverPrimerPagina,
              showQuickFilter: true,
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
  );
};
