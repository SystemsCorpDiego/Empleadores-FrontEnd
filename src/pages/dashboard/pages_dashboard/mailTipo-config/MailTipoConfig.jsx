import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import {
  consultar,
  crear,
  actualizar,
  eliminar,
  consultarVariables,
} from './MailTipoConfigApi';
import { axiosMailTipo } from '@/common/api/MailTipoApi';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import { UserContext } from '@/context/userContext';

const DIAS_PROCESO = Array.from({ length: 31 }, (_, index) => index + 1);

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, '') : '');

export const MailTipoConfig = () => {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [diaProceso, setDiaProceso] = useState('');
  const [asuntoMail, setAsuntoMail] = useState('');
  const [cuerpoMail, setCuerpoMail] = useState('');
  const [habilitado, setHabilitado] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tiposMail, setTiposMail] = useState([]);
  const [mailId, setMailId] = useState('');
  const [variablesDescripcion, setVariablesDescripcion] = useState('');

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const cargarFilas = async (idMail) => {
    const data = await consultar(idMail);
    setRows(Array.isArray(data) ? data : data ? [data] : []);
  };

  useEffect(() => {
    const ObtenerTiposMail = async () => {
      const response = await axiosMailTipo.consultar();
      setTiposMail(response);
      if (response && response.length > 0) {
        setMailId(response[0].id);
      } else {
        setLoading(false);
      }
    };
    ObtenerTiposMail();
  }, []);

  useEffect(() => {
    if (!mailId) {
      setRows([]);
      return;
    }
    cargarFilas(mailId).then(() => setLoading(false));
  }, [mailId]);

  useEffect(() => {
    if (!mailId) {
      setVariablesDescripcion('');
      return;
    }
    const ObtenerVariables = async () => {
      const data = await consultarVariables(mailId);
      setVariablesDescripcion(data?.descripcion || '');
    };
    ObtenerVariables();
  }, [mailId]);

  const handleEditClick = (row) => () => {
    setSelectedId(row.id);
    setDiaProceso(row.diaProceso || '');
    setAsuntoMail(row.asuntoMail || '');
    setCuerpoMail(row.cuerpoMail || '');
    setHabilitado(!!row.habilitado);
    setShowForm(true);
  };

  const handleNuevo = () => {
    setSelectedId(null);
    setDiaProceso('');
    setAsuntoMail('');
    setCuerpoMail('');
    setHabilitado(true);
    setShowForm(true);
  };

  const handleCancelar = () => {
    setShowForm(false);
  };

  const handleDeleteClick = (row) => async () => {
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
          const bBajaOk = await eliminar(row.id);
          if (bBajaOk) {
            setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
          }
        }
      });
    } catch (error) {
      console.error('Error al ejecutar eliminar:', error);
    }
  };

  const handleGuardar = async () => {
    setSaving(true);
    const payload = {
      diaProceso: diaProceso ? Number(diaProceso) : null,
      asuntoMail,
      cuerpoMail,
      habilitado,
      mailId,
    };

    let success = false;
    let registroGuardado = null;

    if (selectedId) {
      const actualizado = await actualizar({ ...payload, id: selectedId });
      if (actualizado) {
        success = true;
        registroGuardado = { ...payload, id: selectedId };
      }
    } else {
      const created = await crear(payload);
      if (created && created.id) {
        setSelectedId(created.id);
        success = true;
        registroGuardado = created;
      }
    }

    if (registroGuardado) {
      setRows((prevRows) => {
        const index = prevRows.findIndex(
          (row) => row.id === registroGuardado.id,
        );
        if (index === -1) {
          return [...prevRows, registroGuardado];
        }
        const nuevasFilas = [...prevRows];
        nuevasFilas[index] = registroGuardado;
        return nuevasFilas;
      });
    }

    setSaving(false);
    if (success) {
      setShowForm(false);
    }
  };

  const columnas = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'diaProceso',
      headerName: 'Día Proceso',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
    },
    {
      field: 'asuntoMail',
      headerName: 'Asunto del Mail',
      flex: 2,
      headerClassName: 'header--cell',
    },
    {
      field: 'cuerpoMail',
      headerName: 'Cuerpo del Mail',
      flex: 3,
      headerClassName: 'header--cell',
      renderCell: ({ value }) => {
        const text = stripHtml(value);
        return (
          <span
            title={text}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      field: 'habilitado',
      headerName: 'Habilitado',
      type: 'boolean',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
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
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          className="textPrimary"
          onClick={handleEditClick(row)}
          color="inherit"
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="container">
      <h1>Configuración de Mail por Aviso de Deuda</h1>
      <Box sx={{ p: 3, maxWidth: 960, mx: 'auto' }}>
        {showForm && selectedId && (
          <Typography sx={{ mb: 4 }}>
            <strong>
              {selectedId
                ? `Editando registro #${selectedId}`
                : 'Nuevo registro'}
            </strong>
          </Typography>
        )}

        <Box sx={{ width: 300, mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="tipo-mail-label">Tipo de Mail</InputLabel>
            <Select
              labelId="tipo-mail-label"
              label="Tipo de Mail"
              value={mailId}
              onChange={(event) => setMailId(event.target.value)}
            >
              {tiposMail.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Variables Cuerpo del Mail: </strong>
            {variablesDescripcion}
          </Typography>
        </Box>
        {showForm && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 3, width: 200 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="dia-proceso-label">Día de Proceso</InputLabel>
                <Select
                  labelId="dia-proceso-label"
                  label="Día de Proceso"
                  value={diaProceso}
                  onChange={(event) => setDiaProceso(event.target.value)}
                >
                  {DIAS_PROCESO.map((dia) => (
                    <MenuItem key={dia} value={dia}>
                      {dia}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={habilitado}
                    onChange={(event) => setHabilitado(event.target.checked)}
                  />
                }
                label="Habilitado"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Asunto del Mail"
                value={asuntoMail}
                onChange={(event) => setAsuntoMail(event.target.value)}
              />
            </Box>

            <Box sx={{ mb: 7 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Cuerpo del Mail
              </Typography>
              <ReactQuill
                theme="snow"
                value={cuerpoMail}
                onChange={setCuerpoMail}
                modules={QUILL_MODULES}
                style={{ height: '320px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleGuardar}
                disabled={saving}
              >
                {saving
                  ? 'Guardando...'
                  : selectedId
                    ? 'Actualizar'
                    : 'Guardar'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelar}
                disabled={saving}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>
        )}

        {!showForm && (
          <>
            <Box sx={{ mb: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNuevo}
              >
                Nuevo Registro
              </Button>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
              <StripedDataGrid
                rows={rows}
                columns={columnas}
                getRowId={(row) => row.id}
                getRowClassName={(params) =>
                  rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
                }
                localeText={dataGridStyle.toolbarText}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={pageSizeOptions}
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};
