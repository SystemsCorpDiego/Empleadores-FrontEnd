import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import { consultar, crear, actualizar } from './GestionDeudaMailConfigApi';

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

export const GestionDeudaMailConfig = () => {
  const [config, setConfig] = useState(null);
  const [fechaEnvio, setFechaEnvio] = useState(null);
  const [cuerpoMail, setCuerpoMail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarConfig = async () => {
      const data = await consultar();
      if (data && data.id) {
        setConfig(data);
        setFechaEnvio(data.fechaEnvio ? dayjs(data.fechaEnvio) : null);
        setCuerpoMail(data.cuerpoMail || '');
      }
      setLoading(false);
    };
    cargarConfig();
  }, []);

  const handleGuardar = async () => {
    setSaving(true);
    const payload = {
      fechaEnvio: fechaEnvio ? fechaEnvio.toISOString() : null,
      cuerpoMail,
    };

    if (config && config.id) {
      const ok = await actualizar({ ...payload, id: config.id });
      if (ok) {
        setConfig((prev) => ({ ...prev, ...payload }));
      }
    } else {
      const data = await crear(payload);
      if (data && data.id) {
        setConfig(data);
      }
    }
    setSaving(false);
  };

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
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <DatePicker
              label="Fecha de Envío"
              value={fechaEnvio}
              onChange={(newValue) => setFechaEnvio(newValue)}
              slotProps={{ textField: { size: 'small' } }}
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

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleGuardar}
            disabled={saving}
          >
            {saving ? 'Guardando...' : config?.id ? 'Actualizar' : 'Guardar'}
          </Button>
        </Paper>
      </Box>
    </div>
  );
};
