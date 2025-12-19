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
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import formatter from '@/common/formatter';
import { ThreeCircles } from 'react-loader-spinner'; //import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/es'; // Importa el locale español de moment
import { useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import moment from 'moment';
import { esES } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { axiosGestionDeudas } from './../Entidades/GestionApi';
import Tooltip from '@mui/material/Tooltip';

//moment.locale('es');

export const OpcionesDePago = ({
  cuitInput,
  cuotas,
  setCuotas,
  fechaIntencion,
  setFechaIntencion,
  medioPago,
  setMedioPago,
  detalleConvenio,
  setDetalleConvenio,
  importeDeDeuda,
  setImporteDeDeuda,
  intereses,
  setIntereses,
  saldoAFavorUtilizado,
  handleGenerarConvenio,
  handleActualizarConvenio,
  isEditar,
  isVer,
  showLoading,
}) => {
  const [locale, setLocale] = useState('esES');
  const [parametrosConvenios, setParametrosConvenios] = useState(null);
  const [inabilitar, setInabilitar] = useState(false);

  console.log('OpcionesDePago - isEditar', isEditar);
  console.log('OpcionesDePago - isVer', isVer);

  useEffect(() => {
    moment.locale('es');
    console.log(window.location.hash);
    if (window.location.hash === '#/dashboard/gestiondeuda') {
      console.log('entre al reset');
      setFechaIntencion(null);
      setIntereses(0);
      setImporteDeDeuda(0);
    }
    console.log(medioPago);
    const fetchParametrosConvenios = async () => {
      const parametros =
        await axiosGestionDeudas.getParametrosConvenio(cuitInput);
      //Este if se utiliza para setear los valores que vienen del convenio para que se puedan mostrar
      //pero inabilita la opcion de guardar ya que no tiene parametros en los cuales basarse
      if (!parametros) {
        setInabilitar(true);
        if (isEditar || isVer) {
          const parametrosVista = {
            cuotas: cuotas,
            diasIntencion: 60,
            mediosDePago: [medioPago],
          };
          setParametrosConvenios(parametrosVista);
        }
        return;
      }
      setParametrosConvenios(parametros);
    };
    fetchParametrosConvenios();
    console.log('Parametros de convenios:', parametrosConvenios);
  }, []);

  const convenioParametriaFechaPagoMax = () => {
    if (parametrosConvenios) {
      if (
        parametrosConvenios.diasIntencion &&
        parametrosConvenios.diasIntencion > 0
      ) {
        var fHasta = dayjs().add(parametrosConvenios.diasIntencion, 'day');
        return fHasta;
      }
    }
    return null;
  };

  var dynamicTitle = 'Debe ingresar una fecha futura ';
  if (convenioParametriaFechaPagoMax()) {
    dynamicTitle =
      dynamicTitle +
      ` hasta el dia ${convenioParametriaFechaPagoMax().format('DD/MM/YYYY')} `;
  }

  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, esES), [theme]);
  console.log('detalleConvenio:', detalleConvenio);
  return (
    <Box p={3} sx={{ margin: '60px auto', padding: 0 }}>
      <Typography variant="h6" gutterBottom>
        OPCIONES DE PAGO
      </Typography>
      <Typography variant="body2" gutterBottom>
        IMPORTE CALCULADO TENIENDO EN CUENTA TODOS LOS PERIODOS ADEUDADOS Y LAS
        ACTAS EMITIDAS
      </Typography>
      <ThemeProvider theme={themeWithLocale}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2} md={4}>
                <FormControl fullWidth>
                  <FormLabel>Cantidad cuotas</FormLabel>
                  <Select
                    value={cuotas}
                    onChange={(e) => setCuotas(e.target.value)}
                    disabled={isVer}
                  >
                    {parametrosConvenios &&
                      parametrosConvenios.cuotas > 0 &&
                      Array.from(
                        { length: parametrosConvenios.cuotas },
                        (_, i) => i + 1,
                      ).map((number) => (
                        <MenuItem key={number} value={number}>
                          {number}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={5} md={4}>
                <FormControl fullWidth>
                  <Tooltip title={dynamicTitle}>
                    <FormLabel>Fecha de intención de pago de cuota 1</FormLabel>

                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="es"
                      localeText={
                        esES.components.MuiLocalizationProvider.defaultProps
                          .localeText
                      }
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        value={fechaIntencion ? dayjs(fechaIntencion) : null}
                        onChange={(newValue) => {
                          console.log('Fecha de intención de pago:', newValue);
                          console.log(
                            'parametrosConvenios:',
                            parametrosConvenios,
                          );

                          if (newValue) {
                            if (newValue.isValid()) {
                              if (!dayjs().isAfter(newValue)) {
                                console.log(
                                  'OK-newValue.year(): ',
                                  newValue.year(),
                                );
                                console.log('OK-newValue: ', newValue);

                                var fHasta = convenioParametriaFechaPagoMax();
                                if (fHasta) {
                                  console.log('OK-CON fHasta: ', fHasta);
                                  if (!newValue.isAfter(fHasta)) {
                                    console.log(
                                      'OK-fHasta - EJECUTA setFechaIntencion',
                                    );
                                    setFechaIntencion(dayjs(newValue));
                                  } else {
                                    setDetalleConvenio({});
                                  }
                                } else {
                                  setFechaIntencion(dayjs(newValue));
                                }
                              } else {
                                setDetalleConvenio({});
                              }
                            } else {
                              console.log('newValue.year(): ', newValue.year());
                              console.log('dayjs().year(): ', dayjs().year());
                              console.log(
                                '*** OJO - NO EJECUTO setFechaIntencion(dayjs(newValue));',
                              );
                              setDetalleConvenio({});
                            }
                            //setFechaIntencion(dayjs(newValue));
                          }
                        }}
                        disabled={isVer}
                        minDate={dayjs()}
                        maxDate={
                          parametrosConvenios
                            ? dayjs().add(
                                parametrosConvenios.diasIntencion,
                                'day',
                              )
                            : undefined
                        }
                        slotProps={{
                          textField: {
                            inputProps: {
                              placeholder: 'DD/MM/YYYY',
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Tooltip>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2} md={4}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Medio de pago</FormLabel>
                  <RadioGroup
                    value={medioPago}
                    onChange={(e) => setMedioPago(e.target.value)}
                  >
                    <Grid container>
                      {parametrosConvenios?.mediosDePago?.map((medio) => (
                        <Grid item xs={6} key={medio}>
                          <FormControlLabel
                            value={medio}
                            control={<Radio />}
                            label={medio}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <Box border={1} p={2}>
              <Typography variant="h6">DETALLE DE CONVENIO</Typography>
              <Typography variant="body1">
                Ud. está generando un convenio con la siguiente información:
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Importe de deuda:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {formatter.currencyString(importeDeDeuda)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Saldo a Favor utilizado:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {formatter.currencyString(saldoAFavorUtilizado)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Monto a financiar:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {formatter.currencyString(
                      importeDeDeuda - saldoAFavorUtilizado,
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Cantidad de cuotas:</strong>
                  </Typography>
                  <Typography variant="body1">{cuotas}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Intereses de financiación:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {detalleConvenio.length > 0
                      ? formatter.currencyString(
                          detalleConvenio.reduce(
                            (acumulador, e) => acumulador + e.interes,
                            0,
                          ),
                        )
                      : intereses}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Total a pagar:</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatter.currencyString(
                      importeDeDeuda -
                        saldoAFavorUtilizado +
                        (detalleConvenio.length > 0
                          ? detalleConvenio.reduce(
                              (acumulador, e) => acumulador + e.interes,
                              0,
                            )
                          : intereses),
                    )}
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
                  {Array.isArray(detalleConvenio) &&
                    detalleConvenio.map((cuota, i) => (
                      <tr key={i + 1}>
                        <td className="pr2">{cuota.numero}</td>
                        <td className="pr2">
                          {formatter.currencyString(
                            (cuota.importe || 0) + (cuota.interes || 0),
                          )}
                        </td>
                        <td className="pr2">
                          {cuota.vencimiento
                            ? moment(cuota.vencimiento).format('DD/MM/YYYY')
                            : '–'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <Grid item xs={12}>
                {!showLoading && (
                  <Button
                    variant="contained"
                    disabled={isVer || inabilitar}
                    color="primary"
                    fullWidth
                    onClick={
                      isEditar
                        ? handleActualizarConvenio
                        : handleGenerarConvenio
                    }
                  >
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
      </ThemeProvider>
    </Box>
  );
};
