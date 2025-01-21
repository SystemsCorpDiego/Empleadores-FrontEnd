import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import './MisDDJJFiltro.css';
import { MisDDJJGrilla } from './MisDDJJGrilla';
import { axiosDDJJ } from './MisDDJJGrillaApi';
import swal from '@/components/swal/swal';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import localStorageService from '@/components/localStorage/localStorageService';
import { ThreeCircles } from 'react-loader-spinner';

export const MisDDJJFiltro = ({ handlerDDJJEditar }) => {
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [filtro, setFiltro] = useState({
    desde: ahoraMenosUnAnio,
    hasta: ahora,
  });
  const [rows, setRows] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  const handlerConsultar = async () => {
    if (!ID_EMPRESA) {
      swal.showError('El sistema no tiene seteado un Id de Empresa.');
      return false;
    }
    try {
      setShowLoading(true);
      let desde = null;
      if (filtro.desde !== null) {
        desde = filtro.desde.startOf('month').format('YYYY-MM-DD');
      }
      let hasta = null;
      if (filtro.hasta !== null) {
        hasta = filtro.hasta.startOf('month').format('YYYY-MM-DD');
      }

      const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA, desde, hasta);
      console.log('handlerConsultar - ddjjResponse: ', ddjjResponse);
      setRows(ddjjResponse);

      console.log('----------------');
      console.log('MisDDJJFiltro - now: ', new Date());
      console.log('MisDDJJFiltro -handlerConsultar - rows: ', rows);
      console.log('----------------');
      setShowLoading(false);
    } catch (error) {
      console.error('Error al buscar declaraciones juradas:', error);
    }
  };

  const initFiltro = () => {
    setFiltro({
      desde: ahoraMenosUnAnio,
      hasta: ahora,
    });
    handlerConsultar();
  };

  useEffect(() => {
    handlerConsultar();
  }, []);

  return (
    <div>
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
      {!showLoading && (
        <>
          <div className="mis_declaraciones_juradas_container">
            <Stack
              spacing={4}
              direction="row"
              display="flex"
              justifyContent="initial"
              alignItems="center"
            >
              <DemoContainer components={['DatePicker']}>
                <DesktopDatePicker
                  label={'Periodo desde'}
                  views={['month', 'year']}
                  closeOnSelect={true}
                  onChange={(oValue) => setFiltro({ ...filtro, desde: oValue })}
                  value={filtro.desde}
                />
              </DemoContainer>

              <DemoContainer components={['DatePicker']}>
                <DesktopDatePicker
                  label={'Periodo hasta'}
                  views={['month', 'year']}
                  closeOnSelect={true}
                  onChange={(oValue) => setFiltro({ ...filtro, hasta: oValue })}
                  value={filtro.hasta}
                />
              </DemoContainer>
            </Stack>

            <Stack
              spacing={4}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                onClick={handlerConsultar}
                variant="contained"
                style={{ marginLeft: '2em' }}
              >
                Buscar
              </Button>
              <Button
                onClick={initFiltro}
                variant="contained"
                style={{ marginLeft: '2em' }}
              >
                Limpiar Filtro
              </Button>
            </Stack>
          </div>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <MisDDJJGrilla
              rows={rows}
              setRows={setRows}
              handlerDDJJEditar={handlerDDJJEditar}
            />
          </Stack>
        </>
      )}
    </div>
  );
};
