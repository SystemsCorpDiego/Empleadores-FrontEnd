import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Grid,
  styled,
} from '@mui/material';
import { generarBoletaSinDDJJ } from './OtrosPagosApi';
import localStorageService from '@/components/localStorage/localStorageService';
import './OtrosPagos.css';
import swal from '@/components/swal/swal';

import CurrencyInput from 'react-currency-input-field';

const StyledCurrencyInput = styled(CurrencyInput)(({ theme }) => ({
  ...theme.typography.body1,
  padding: '10px 14px',
  borderRadius: 4,
  border: '1px solid rgba(0, 0, 0, 0.23)',
  width: '100%',
  '&:hover': {
    borderColor: 'rgba(0, 0, 0, 0.87)',
  },
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
  },
}));

export const GenerarOtrosPagos = () => {
  const [intencionDePago, setIntencionDePago] = useState('');
  const [entidad, setEntidad] = useState('');
  const [nroActa, setNroActa] = useState('');
  const [importe, setImporte] = useState('');
  const [deshabilitar, setDeshabilitar] = useState(false);
  const navigate = useNavigate();

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const hoy = new Date().toISOString().split('T')[0];

  const handleImprimir = async () => {
    const body = {
      entidad,
      nroActa,
      importe,
      intencionDePago: new Date(`${intencionDePago}`).toISOString(),
      razonDePago: 'Nro Acta: ' + nroActa,
    };
    try {
      setDeshabilitar(true);
      const data = await generarBoletaSinDDJJ(ID_EMPRESA, body);
      if (data && data.id) {
        setTimeout(function () {
          navigate('/dashboard/boletas');
        }, 4000);
      } else {
        setDeshabilitar(false);
      }
    } catch (error) {
      console.error(error);
      swal.showError('Ocurrio un problema al intentar generar la boleta');
      navigate('/dashboard/boletas');
    }
  };

  return (
    <div className="otros_pagos_container">
      <h1>Boleta Acta</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha intención de Pago"
            type="date"
            fullWidth
            value={intencionDePago}
            inputProps={{ min: hoy }}
            onChange={(e) => setIntencionDePago(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Entidad</InputLabel>
            <Select
              value={entidad}
              onChange={(e) => setEntidad(e.target.value)}
            >
              <MenuItem value="UOMA">UOMA</MenuItem>
              <MenuItem value="OSPIM">OSPIM</MenuItem>
              <MenuItem value="AMTIMA">AMTIMA</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nro Acta"
            fullWidth
            type="number"
            value={nroActa}
            onChange={(e) => setNroActa(e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Importe"
            InputProps={{
              inputComponent: StyledCurrencyInput,
              inputProps: {
                placeholder: 'Importe',
                value: importe,
                onValueChange: (value) => {
                  setImporte(value);
                  console.log(importe);
                },
                decimalScale: 2,
                decimalSeparator: ',',
                groupSeparator: '.',
                prefix: '',
              },
            }}
            fullWidth
            //value={importe}
            //onChange={(e) => setImporte(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={
                !intencionDePago ||
                !entidad ||
                !importe ||
                !nroActa ||
                deshabilitar
              }
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};
