import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import formatter from '@/common/formatter';
import { ThreeCircles } from 'react-loader-spinner';//import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/es'; // Importa el locale español de moment
import { useEffect } from 'react';

moment.locale('es');

export const OpcionesDePago = ({
  cuotas,
  setCuotas,
  fechaIntencion,
  setFechaIntencion,
  medioPago,
  setMedioPago,
  detalleConvenio,
  importeDeDeuda,
  intereses,
  saldoAFavorUtilizado,
  handleGenerarConvenio,
  handleActualizarConvenio,
  isEditar,
  showLoading
}) => {
  console.log('detalleConvenio:', detalleConvenio);
  return (
    <Box p={3} sx={{ margin: '60px auto', padding: 0 }}>
      <Typography variant="h6" gutterBottom>OPCIONES DE PAGO</Typography>
      <Typography variant="body2" gutterBottom>
        IMPORTE CALCULADO TENIENDO EN CUENTA TODOS LOS PERIODOS ADEUDADOS Y LAS ACTAS EMITIDAS
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2} md={4}>
              <FormControl fullWidth>
                <FormLabel>Cantidad cuotas</FormLabel>
                <Select
                  value={cuotas}
                  onChange={(e) => setCuotas(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6].map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <FormControl fullWidth>
                <FormLabel>Fecha de intención de pago de cuota 1</FormLabel>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
                  <DatePicker 
                    format="DD/MM/YYYY"
                    value={fechaIntencion}
                    onChange={(newValue) => setFechaIntencion(newValue)}
                    minDate={moment()}
                    slotProps={{
                      textField: {
                        inputProps: { placeholder: 'DD/MM/YYYY' }
                      }
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2} md={4}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Medio de pago</FormLabel>
                <RadioGroup
                  value={medioPago}
                  onChange={(e) => setMedioPago(e.target.value)}
                >
                  <FormControlLabel value="CHEQUE" control={<Radio />} label="CHEQUE" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box border={1} p={2}>
            <Typography variant="h6">DETALLE DE CONVENIO</Typography>
            <Typography variant="body1">Ud. está generando un convenio con la siguiente información:</Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2"><strong>Importe de deuda:</strong></Typography>
                <Typography variant="body1">{formatter.currencyString(importeDeDeuda)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2"><strong>Saldo a Favor utilizado:</strong></Typography>
                <Typography variant="body1">{formatter.currencyString(saldoAFavorUtilizado)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2"><strong>Monto a financiar:</strong></Typography>
                <Typography variant="body1">{formatter.currencyString(importeDeDeuda - saldoAFavorUtilizado)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2"><strong>Cantidad de cuotas:</strong></Typography>
                <Typography variant="body1">{cuotas}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2"><strong>Intereses de financiación:</strong></Typography>
                <Typography variant="body1">{detalleConvenio.length >0 ?formatter.currencyString( detalleConvenio.reduce((acumulador, e) => acumulador + e.interes,0 )) : intereses}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2"><strong>Total a pagar:</strong></Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatter.currencyString(importeDeDeuda + (detalleConvenio.length >0 ? detalleConvenio.reduce((acumulador, e) => acumulador + e.interes,0 ) : intereses))}
                </Typography>
              </Grid>
            </Grid>

            <h4>Detalle cuotas</h4>
            <table>
              <thead>
                <tr>
                  <th style={{ paddingRight: '64px' }}>Cuota Nº</th>
                  <th style={{ paddingRight: '64px' }}>Valor</th>
                  <th style={{ paddingRight: '64px' }}>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(detalleConvenio) && detalleConvenio.map((cuota, i) => (
                  <tr key={i + 1}>
                    <td className='pr2'>{cuota.numero}</td>
                    <td className='pr2'>{formatter.currencyString((cuota.importe || 0) + (cuota.interes || 0))}</td>
                    <td className='pr2'>
                      {cuota.vencimiento
                        ? moment(cuota.vencimiento).format("DD/MM/YYYY")
                        : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Grid item xs={12}>
              {!showLoading && (
                <Button variant="contained" color="primary" fullWidth onClick={isEditar ? handleActualizarConvenio : handleGenerarConvenio}>
                  GUARDAR CONVENIO
                </Button>
              )}
              <ThreeCircles
                visible={showLoading}
                height="100"
                width="100"
                color="#1A76D2"
                ariaLabel="three-circles-loading"
                wrapperStyle={{ margin: '15%', marginLeft: '50%' }}
              />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};