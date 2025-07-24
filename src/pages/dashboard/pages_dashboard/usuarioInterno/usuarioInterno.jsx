import * as locales from '@mui/material/locale';
import { useState, useEffect, useMemo, useContext } from 'react';
import {
  Box,
  Button,
  Tooltip,
  IconButton,
  alpha,
  TextField,
  Grid,
  InputAdornment,
  OutlinedInput,
  InputLabel,
} from '@mui/material';


import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ThreeCircles } from 'react-loader-spinner';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';

import { axiosUsuariosInternos } from './usuarioInternoApi';
import { axiosRoles } from '@pages/dashboard/pages_dashboard/roles/RolesApi';

import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import swal from '@/components/swal/swal';
import './usuarioInterno.css';

import { dataGridStyle } from '@/common/dataGridStyle';
import { margin } from '@mui/system';
import { UserContext } from '@/context/userContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
};

const crearNuevoRegistro = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
  } = props;

  const altaHandleClick = () => {
    if (rows) {
      const editRow = rows.find((row) => !row.id);
      if (typeof editRow === 'undefined' || editRow.id) {
        const newReg = {
          apellido: '',
          nombre: '',
          descripcion: '',
          email: '',
          rolId: '',
          notificaciones: '',
          habilitado: null,
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
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const UsuarioInterno = () => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const {
    paginationModel,
    setPaginationModel,
    pageSizeOptions,
    themeWithLocale,
  } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  const theme = useTheme();

  useEffect(() => {
    const ObtenerUsuariosInternos = async () => {
      const response = await axiosUsuariosInternos.consultar();
      console.log('response: ', response);
      setRows(response.map((item) => ({ id: item.id, ...item })));
    };
    ObtenerUsuariosInternos();
  }, []);

  useEffect(() => {
    const ObtenerRol = async () => {
      const rol = await axiosRoles.deUsuarioConsultar();
      setRoles(rol);
    };
    ObtenerRol();
  }, []);

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

  const handleGestionClave = (row) => () => {
    setNombre(row.nombre);
    setApellido(row.apellido);
    setUsuario(row.descripcion);
    setEmail(row.email);
    setClave(row.clave);
    setRepetirClave(row.clave);
    setIdUsuario(row.id);
    handleOpen();
  };

  const processRowUpdate = async (newRow, oldRow) => {
    console.log('processRowUpdate - INIT');
    let bOk = false;

    if (!newRow.id) {
      console.log('processRowUpdate - ALTA');
      try {
        delete newRow.repetirClave;
        const data = await axiosUsuariosInternos.crear(newRow);
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
      console.log('3 - processRowUpdate - MODI ');
      try {
        delete newRow.repetirClave;
        bOk = await axiosUsuariosInternos.actualizar(newRow);
        console.log('4 - processRowUpdate - MODI - bOk: ' + bOk);
        if (bOk) {
          setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
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

  const handleHabilitar = (id) => async () => {
    const updatedRow = { ...rows.find((row) => row.id === id) };
    updatedRow.habilitado = !updatedRow.habilitado;
    setRows(rows.map((row) => (row.id === id ? updatedRow : row)));

    await axiosUsuariosInternos.habilitar(id, updatedRow.habilitado);
  };

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [claveError, setClaveError] = useState(false);
  const [repetirClave, setRepetirClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleClave = (e) => {
    setClaveError(!validatePassword(e.target.value));
    setClave(e.target.value);
  };

  const handleRepetirClave = (e) => {
    setRepetirClave(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    console.log(rows);
    setShowLoading(true);
    e.preventDefault();
    if (clave !== repetirClave) {
      swal.showError('Las claves no coinciden !');
      setShowLoading(false);
      handleClose();
      return; // Para salir de la función sin continuar
    }

    // Buscar el usuario en el array de usuarios
    const usuario = rows.find((usuario) => usuario.id === idUsuario);
    console.log(usuario);

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.clave = clave;

    const resp = await axiosUsuariosInternos.actualizar(usuario);
    if (resp) {
      swal.showSuccess('Clave actualizada correctamente !');
    }
    setShowLoading(false);
    handleClose();
  };

  const columns = [
    {
      field: 'apellido',
      headerName: 'Apellido',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueParser: (value, row, column, apiRef) => {
        return value?.toUpperCase();
      },
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueParser: (value, row, column, apiRef) => {
        return value?.toUpperCase();
      },
    },
    {
      field: 'descripcion',
      headerName: 'Usuario',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      type: 'string',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'rolId',
      headerName: 'Rol',
      flex: 2,
      type: 'singleSelect',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: roles.map((item) => {
        return { value: item.id, label: item.descripcion };
      }),
    },
    {
      field: 'notificaciones',
      headerName: 'Notificaciones',
      flex: 2,
      type: 'singleSelect',
      editable: true,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueOptions: ['Si', 'No'],
      valueGetter: (params) => {
        return params.row.notificaciones ? 'Si' : 'No';
      },
    },
    {
      field: 'habilitado',
      headerName: 'Habilitado',
      flex: 2,
      width: 40,
      minWidth: 25,
      maxWidth: 80,
      type: 'string',
      headerAlign: 'center',
      align: 'center',
      editable: false,
      valueGetter: (params) => {
        return params.row.habilitado ? 'Si' : 'No';
      },
      headerClassName: 'header--cell',
      cellClassName: 'habilitado--cell',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 2,
      type: 'actions',
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

        const actions = [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              row.habilitado ? (
                <CloseIcon sx={{ color: 'red' }} />
              ) : (
                <CheckIcon sx={{ color: 'green' }} />
              )
            }
            label={row.habilitado ? 'Cerrar' : 'Abrir'}
            onClick={handleHabilitar(row.id)}
            color="inherit"
          />,
        ];

        actions.push(
          <Tooltip title="Gestionar Clave" key="clave" placement="top">
            <GridActionsCellItem
              icon={<LockPersonIcon />}
              label="Gestionar Clave"
              sx={{ color: 'primary.main' }}
              onClick={handleGestionClave(row)}
            />
          </Tooltip>,
        );

        return actions;
      },
    },
  ];

  return (
    <div className="usuario_interno_container">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h1>Alta Usuario Interno</h1>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
      <Box
        sx={{
          height: '600px',
          width: '100%',
          overflowX: 'auto',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <ThemeProvider theme={themeWithLocale}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => rows.indexOf(row)}
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
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={handleFormSubmit}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  textAlign: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '5px',
                  width: '400px',
                  marginBottom: '20px',
                  color: theme.palette.primary.main,
                }}
              >
                Gestión de Clave
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    Nombre: {nombre}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    Apellido: {apellido}
                  </p>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    Usuario: {usuario}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <p
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    Email: {email}
                  </p>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputLabel htmlFor="clave">Clave </InputLabel>
                  <OutlinedInput
                    value={clave}
                    label="Clave"
                    variant="outlined"
                    fullWidth
                    error={claveError}
                    margin="dense"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleClave}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel htmlFor="repetir-clave">
                    Repetir Clave{' '}
                  </InputLabel>
                  <OutlinedInput
                    value={repetirClave}
                    label="Repetir Clave"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    error={clave !== repetirClave}
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleRepetirClave}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Grid>
              </Grid>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{ width: '76%' }}
              >
            <ThreeCircles
              visible={showLoading}
              height="35"
              width="35"
              color="#1A76D2"
              ariaLabel="three-circles-loading"
              wrapperStyle={{
                marginTop: '20px',
              }}
              wrapperClass=""
            />
            {!showLoading && (
              <Button
                variant="contained"
                sx={{ marginTop: '20px' }}
                type="submit"
              >
                Actualizar
              </Button>
            )}
                <Button
                  variant="contained"
                  sx={{ marginTop: '20px' }}
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};
