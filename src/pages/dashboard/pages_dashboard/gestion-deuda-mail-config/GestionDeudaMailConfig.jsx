import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import {
  consultar,
  crear,
  actualizar,
  eliminar,
} from './GestionDeudaMailConfigApi';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import formatter from '@/common/formatter';
import { UserContext } from '@/context/userContext';

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

export const GestionDeudaMailConfig = () => {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [fechaProceso, setfechaProceso] = useState(null);
  const [cuerpoMail, setCuerpoMail] = useState('');
  const [habilitado, setHabilitado] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const cargarFilas = async () => {
    const data = await consultar();
    setRows(Array.isArray(data) ? data : data ? [data] : []);
  };

  useEffect(() => {
    cargarFilas().then(() => setLoading(false));
  }, []);

  const handleEditClick = (row) => () => {
    setSelectedId(row.id);
    setfechaProceso(row.fechaProceso ? dayjs(row.fechaProceso) : null);
    setCuerpoMail(row.cuerpoMail || '');
    setHabilitado(!!row.habilitado);
    setShowForm(true);
  };

  const handleNuevo = () => {
    setSelectedId(null);
    setfechaProceso(null);
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
      fechaProceso: fechaProceso ? fechaProceso.toISOString() : null,
      cuerpoMail,
      habilitado,
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
      field: 'fechaProceso',
      headerName: 'Fecha Proceso',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        console.log('value: {}', value);
        return formatter.dateString(value);
      },
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
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          className="textPrimary"
          onClick={handleDeleteClick(row)}
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
        {showForm && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {selectedId
                ? `Editando registro #${selectedId}`
                : 'Nuevo registro'}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="Fecha de Proceso"
                value={fechaProceso}
                onChange={(newValue) => setfechaProceso(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
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
