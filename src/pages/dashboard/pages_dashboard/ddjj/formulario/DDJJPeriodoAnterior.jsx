import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Stack,
} from '@mui/material';
import Swal from 'sweetalert2';
import swal from '@/components/swal/swal';
import formatter from '@/common/formatter';
import dayjs from 'dayjs';
import { axiosDDJJ } from './DDJJApi';
import localStorageService from '@/components/localStorage/localStorageService';

export const DDJJPeriodoAnterior = ({ habiModif, handlerGrillaActualizar }) => {
  console.log('DDJJPeriodoAnterior - INIT - habiModif:', habiModif);
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [showCtrlPeriodo, setShowCtrlPeriodo] = useState(false); //EX mostrarPeriodos - muestra o no Control de seleccion de Periodo.-
  const [periodoACopiar, setPeriodoACopiar] = useState(null); //EX otroPeriodo

  const handlerBuscarPeriodo = async () => {
    //Ex buscarPeriodoAnterior
    let periodoDayjs = null;
    if (periodoACopiar) {
      periodoDayjs = dayjs(periodoACopiar.$d).format('YYYY-MM-DD');
    }

    const ddjjACopiar = await axiosDDJJ.getPeriodoAnterior(
      ID_EMPRESA,
      periodoDayjs,
    );

    if (!ddjjACopiar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: periodoDayjs
          ? `No se encontró la DDJJ para el período seleccionado (${formatter.periodoString(periodoACopiar)}).`
          : 'No se encontró un período anterior',
      });
      return;
    }

    //Nueva llamada a Grilla
    handlerGrillaActualizar(ddjjACopiar.afiliados);
    if (periodoDayjs) {
      console.log('periodoACopiar:', formatter.periodoString(periodoACopiar));
      swal.showSuccess(
        `El período ${formatter.periodoString(periodoACopiar)} fue copiado con exito`,
      );
    } else {
      swal.showSuccess('El período anterior fue copiado con exito');
    }
  };

  return (
    <Box className="copiar_periodo_container">
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="ultimoPeriodoPresentado"
        name="radio-buttons-group"
        onChange={(event) => {
          const aux = event.target.value === 'elegirOtro';
          setShowCtrlPeriodo(aux);
          if (!aux) {
            setPeriodoACopiar(null);
          }
        }}
      >
        <FormControlLabel
          value="ultimoPeriodoPresentado"
          control={<Radio />}
          label="Ultimo período presentado"
        />
        <FormControlLabel
          value="elegirOtro"
          control={<Radio />}
          label="Elegir otro"
          ///disabled={!habiModif}
        />
        <Box className="elegir_otro_container">
          {showCtrlPeriodo && habiModif && (
            <Stack
              spacing={4}
              direction="row"
              sx={{ marginLeft: '-11px', marginTop: '10px' }}
            >
              <DemoContainer components={['DatePicker']}>
                <DesktopDatePicker
                  label={'Otro período'}
                  views={['month', 'year']}
                  closeOnSelect={true}
                  onChange={(date) => setPeriodoACopiar(date)}
                  value={periodoACopiar}
                  disabled={!habiModif}
                />
              </DemoContainer>
            </Stack>
          )}
        </Box>
      </RadioGroup>
      <Button
        variant="contained"
        sx={{
          marginLeft: '114px',
          padding: '6px 45px',
        }}
        onClick={handlerBuscarPeriodo}
        disabled={!habiModif}
      >
        Buscar
      </Button>
    </Box>
  );
};
