
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

export const OpcionesDePago = ({
  cuotas,
  setCuotas,
  fechaIntencion,
  setFechaIntencion,
  noUsar,
  setNoUsar,
  medioPago,
  detalleConvenio,
  saldoAFavorUtilizado
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
                value={formatter.currencyString(detalleConvenio.interesesDeFinanciacion)}
              />
            </Grid>
           {/* <Grid item xs={12}>
              <TextField
                label="Saldo a favor"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={formatter.currencyString(detalleConvenio.saldoAFavor)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noUsar}
                    onChange={() => setNoUsar(!noUsar)}
                  />
                }
                label="No Usar"
              />
            </Grid>
            */}
            <Grid item xs={12}>
              <Typography variant="h6">TOTAL</Typography>
              <TextField
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                value={formatter.currencyString(detalleConvenio.totalAPagar)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth>
                GENERAR
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
        <Box border={1} p={2}>
      <Typography variant="h6">DETALLE DE CONVENIO</Typography>
      <Typography variant="body1">Ud. está generando un convenio con la siguiente información:</Typography>
      <Box component="div" >
        <ul>
          <li>Importe de deuda: {detalleConvenio.importeDeDeuda}</li>
          <li>Intereses de financiación: {detalleConvenio.interesesDeFinanciacion}</li>
          <li>Saldo a Favor utilizado: {saldoAFavorUtilizado}</li>
          <li>Total a pagar: {detalleConvenio.totalAPagar}</li>
          <li>Cantidad de cuotas: {detalleConvenio.cantidadCuotas}</li>
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
          {(detalleConvenio.detalleCuota || []).map((cuota) => (
            <tr key={cuota.numero}>
              <td className='pr2'>{cuota.numero}</td>
              <td className='pr2'>{formatter.currencyString(cuota.valor)}     </td>
              <td className='pr2'>{cuota.vencimiento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
