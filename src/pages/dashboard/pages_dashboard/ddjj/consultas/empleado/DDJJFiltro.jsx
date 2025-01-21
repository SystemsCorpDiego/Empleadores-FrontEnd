import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import './DDJJFiltro.css';
import { axiosDDJJEmpleado } from './DDJJConsultaEmpleadoApi';
import { consultarEmpresas } from '@/common/api/EmpresasApi';

import { DDJJGrilla } from './DDJJGrilla';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ThreeCircles } from 'react-loader-spinner';

export const DDJJFiltro = () => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [filtro, setFiltro] = useState({
    desde: ahoraMenosUnAnio,
    hasta: ahora,
    cuit: null,
  });
  const [empresa, setEmpresa] = useState({ cuit: '', razonSocial: '' });
  const [empresas, setEmpresas] = useState([]);
  const [rows, setRows] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  const handlerConsultar = async () => {
    setShowLoading(true)
    try {
      let desde = null;
      if (filtro.desde !== null) {
        desde = filtro.desde.startOf('month').format('YYYY-MM-DD');
      }
      let hasta = null;
      if (filtro.hasta !== null) {
        hasta = filtro.hasta.startOf('month').format('YYYY-MM-DD');
      }
      let cuit = null;
      if (filtro.cuit !== null) {
        cuit = filtro.cuit;
      }
      //const ddjjResponse = await axiosDDJJ.consultar(ID_EMPRESA, desde, hasta);
      const ddjjResponse = await axiosDDJJEmpleado.consultarFiltrado(
        desde,
        hasta,
        cuit,
      );
      console.log('handlerConsultar - ddjjResponse: ', ddjjResponse);
      setRows(ddjjResponse);
      setShowLoading(false)
    } catch (error) {
      console.error('Error al buscar declaraciones juradas:', error);
    }
  };

  useEffect(() => {
    const ObtenerEmpresas = async () => {
      const empresas = await consultarEmpresas();
      console.log('** ObtenerEmpresa - empresas: ', empresas);
      setEmpresas(empresas);
    };

    ObtenerEmpresas();
    handlerConsultar();
    setShowLoading(false)
  }, []);

  return (
    <div className="declaraciones_juradas_container">
      <h1
        style={{
          marginBottom: '50px',
        }}
      >
        Consulta de Declaraciones Juradas
      </h1>
      <div
        className="mis_declaraciones_juradas_container"
        style={{
          marginBottom: '50px',
        }}
      >
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
              value={filtro.desde || ''}
            />
          </DemoContainer>

          <DemoContainer components={['DatePicker']}>
            <DesktopDatePicker
              label={'Periodo hasta'}
              views={['month', 'year']}
              closeOnSelect={true}
              onChange={(oValue) => setFiltro({ ...filtro, hasta: oValue })}
              value={filtro.hasta || ''}
            />
          </DemoContainer>
          <div
            style={{
              height: '100px',
              width: '550px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '8px',
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={empresas}
              key={(option) => option.id}
              onChange={(event, value) => {
                console.log('** onChange-value:', value);
                setEmpresa(value);

                setFiltro({ ...filtro, cuit: value?.cuit || null });
              }}
              value={empresa}
              getOptionLabel={(reg) => reg.cuit}
              sx={{ width: 190 }}
              renderInput={(params) => <TextField {...params} label="CUIT" />}
            />
            -
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={empresas}
              key={(option) => option.id}
              onChange={(event, value) => {
                console.log('value:', value);
                setEmpresa(value);
                setFiltro({ ...filtro, cuit: value?.cuit || null });
              }}
              value={empresa}
              getOptionLabel={(reg) => reg.razonSocial}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Razón Social" />
              )}
            />
          </div>
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
        </Stack>
      </div>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Box
          sx={{
            margin: '0 auto',
            height: '600px',
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          <ThreeCircles
            visible={showLoading}
            height="100"
            width="100"
            color="#1A76D2"
            ariaLabel="three-circles-loading"
            wrapperStyle={{
              margin: '15%',
              marginLeft: '50%'
            }}
            wrapperClass=""
          />
          {!showLoading && (<DDJJGrilla
            rows={rows}
            showCuit={filtro.cuit == null || filtro.cuit == ''}
          />)}
          
        </Box>
      </Stack>
    </div>
  );
};
