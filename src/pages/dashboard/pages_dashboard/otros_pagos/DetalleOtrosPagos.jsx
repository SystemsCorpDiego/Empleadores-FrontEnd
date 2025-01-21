import React from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import './OtrosPagos.css';

export const DetalleOtrosPagos = ({ data }) => {
  const {
    fechaPago,
    entidad,
    razonPago,
    nroActa,
    descripcionPago,
    importe,
    tipoPagoUOMA,
  } = data;

  return (
    <Box p={3} className="otros_pagos_container">
      <Typography variant="h1" gutterBottom>
        Boleta Acta
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Fecha de Pago: {fechaPago}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Entidad: {entidad}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">Razón de Pago: {razonPago}</Typography>
        </Grid>
        {entidad === 'UOMA' && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              Tipo de Pago UOMA: {tipoPagoUOMA}
            </Typography>
          </Grid>
        )}
        {razonPago !== 'Rectificativa' && (
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Nro Acta: {nroActa}</Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="body1">
            Descripción del Pago: {descripcionPago}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Importe: {importe}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            {/* Botón de guardar deshabilitado */}
            <Button variant="contained" disabled>
              Guardar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
