
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
//import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import formatter from '@/common/formatter';
import { generarConvenio } from '../Entidades/GestionApi';
import { ThreeCircles } from 'react-loader-spinner';

export const OpcionesDePago = ({
  cuotas,
  setCuotas,
  fechaIntencion,
  setFechaIntencion,
  medioPago,
  detalleConvenio,
  importeDeDeuda,
  saldoAFavorUtilizado,
  handleGenerarConvenio,
  showLoading
}) => {

  return (
    <Box p={3} sx={{ margin: '60px auto', padding: 0 }}>
      <Typography variant="h6" gutterBottom>
        OPCIONES DE PAGO
      </Typography>
      <Typography variant="body2" gutterBottom>
        IMPORTE CALCULADO TENIENDO EN CUENTA TODOS LOS PERIODOS ADEUDADOS Y LAS
        ACTAS EMITIDAS
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
                <LocalizationProvider>
                  <DatePicker
                    value={fechaIntencion}
                    onChange={(newValue) => setFechaIntencion(newValue)}
                    renderInput={(params) => <TextField {...params} />}
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
                  <FormControlLabel
                    value="CHEQUE"
                    control={<Radio />}
                    label="CHEQUE"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Intereses de financiación"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={formatter.currencyString(detalleConvenio.importeInteres)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Saldo a favor"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={formatter.currencyString(saldoAFavorUtilizado * -1)}
              />
              {/** <FormControlLabel
                control={
                  <Checkbox
                    checked={noUsar}
                    onChange={() => setNoUsar(!noUsar)}
                  />
                }
                label="No Usar"
              /> */}
            </Grid>
            <Grid item xs={12} marginTop={'2.3em'}>
              <Typography variant="h6">TOTAL</Typography>
              <TextField
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={formatter.currencyString(importeDeDeuda + detalleConvenio.importeInteres)}
              />
            </Grid>
            <Grid item xs={12}>
              {!showLoading && (<Button variant="contained" color="primary" fullWidth onClick={() => handleGenerarConvenio()}>
                GUARDAR CONVENIO
              </Button>)}

              <ThreeCircles
                visible={showLoading}
                height="100"
                width="100"
                color="#1A76D2"
                ariaLabel="three-circles-loading"
                wrapperStyle={{
                  margin: '15%',
                  marginLeft: '50%',
                }}
                wrapperClass=""
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box border={1} p={2}>
            <Typography variant="h6">DETALLE DE CONVENIO</Typography>
            <Typography variant="body1">Ud. está generando un convenio con la siguiente información:</Typography>
            <Box component="div" >
              <ul>
                <li>Importe de deuda: {formatter.currencyString(importeDeDeuda)}</li>
                <li>Intereses de financiación: {formatter.currencyString(detalleConvenio.importeInteres)}</li>
                <li>Saldo a Favor utilizado: {formatter.currencyString(saldoAFavorUtilizado * -1)}</li>
                <li>Total a pagar: {formatter.currencyString(importeDeDeuda + detalleConvenio.importeInteres + saldoAFavorUtilizado)}</li>
                <li>Cantidad de cuotas: {cuotas}</li>
              </ul>
            </Box>
            <table>
              <thead>
                <tr>
                  <th className='pr2'>Cuota Nº</th>
                  <th className='pr2'>Valor</th>
                  <th className='pr2'>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: cuotas }, (_, i) => {
                  const cuota = (detalleConvenio.detalleCuota || [])[i];
                  return (
                    <tr key={i + 1}>
                      <td className='pr2'>{i + 1}</td>
                      <td className='pr2'>{formatter.currencyString((importeDeDeuda + detalleConvenio.importeInteres + saldoAFavorUtilizado)/cuotas)}</td>
                      {/* Calcular la fecha de vencimiento sumando i meses a la fecha de intención */}
                      <td className='pr2'>
                        {fechaIntencion
                          ? fechaIntencion.clone().add(i, 'month').format("YYYY-MM-DD")
                          : '-'}
                      </td></tr>
                  );
                })}
                {/*(detalleConvenio.detalleCuota || []).map((cuota) => (
                  <tr key={cuota.numero}>
                    <td className='pr2'>{cuota.numero}</td>
                    <td className='pr2'>{formatter.currencyString(cuota.valor)}     </td>
                    <td className='pr2'>{cuota.vencimiento}</td>
                  </tr>
                ))*/}
              </tbody>
            </table>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
