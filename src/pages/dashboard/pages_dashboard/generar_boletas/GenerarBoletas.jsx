import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
  Button,
  MenuItem,
  Select,
  Box,
} from '@mui/material';
import { axiosGenerarBoletas } from './GenerarBoletasApi';
import './GenerarBoletas.css';
import { consultarFormasPago } from '@/common/api/FormaPagoApi';
import formatter from '@/common/formatter';
import { getEmpresaId } from '@/components/localStorage/localStorageService';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

//import { Boletas } from '../boletas/Boletas';

import swal from '@/components/swal/swal';
import { ThreeCircles } from 'react-loader-spinner';

export const GenerarBoletas = () => {
  const { id } = useParams();
  console.log(id);
  const DDJJ_ID = id;
  const ID_EMPRESA = getEmpresaId();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [boletas, setBoletas] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [afiliados, setAfiliados] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [primeraSeleccion, setPrimeraSeleccion] = useState(true);
  const [primeraSeleccionFDP, setPrimeraSeleccionFDP] = useState(true);
  const [habilitaBoton, sethabilitaBoton] = useState(true);
  const [isUseEffect, setIsUseEffect] = useState(true);
  const [hasFetchedData, setHasFetchedData] = useState(false); // Nuevo estado para controlar la ejecución única
  const [showLoading, setShowLoading] = useState(false);
  const MOTIVOS_DESC = {
    DI: 'Devolución de Intereses',
    DPD: 'Devolución por pago duplicado',
    O: 'Otros',
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosGenerarBoletas.getBoletasByDDJJid(
          ID_EMPRESA,
          DDJJ_ID,
        );

        setBoletas(data);
        //setDefaultFDP(data);
        setAfiliados(ordenarAfiliadosBoletas(data));
        setPrimeraSeleccion(true);
        setPrimeraSeleccionFDP(true);
        sethabilitaBoton(true);
        setHasFetchedData(true);
      } catch (error) {
        console.error('Error al obtener las boletas:', error);
        navigate(`/dashboard/ddjj`);
      }
    };
    fetchData();
  }, []);

  //Este useEffect se utiliza para poner un valor por defecto dependiendo la fecha de vencimiento
  useEffect(() => {
    if (boletas.detalle_boletas) {
      if (boletas.detalle_boletas.length != 0) {
        const vencimiento = dayjs(
          boletas.detalle_boletas[0].vencimiento,
        ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        const currentDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        if (vencimiento < currentDate) {
          setIntencionDePago(
            boletas.detalle_boletas[0].codigo,
            currentDate,
            true,
          );
        } else {
          setIntencionDePago(
            boletas.detalle_boletas[0].codigo,
            vencimiento,
            true,
          );
        }
      }
    }
  }, [hasFetchedData]);

  useEffect(() => {
    const fetchFormaPago = async () => {
      const fp = await consultarFormasPago();
      setFormasPago(fp);
    };
    fetchFormaPago();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAfiliados = afiliados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const setDefaultFDP = (data) => {
    data.detalle_boletas.forEach(
      (element) => (element.formaDePago = 'VENTANILLA'),
    );
    setBoletas(data);
  };

  const ordenarAfiliadosBoletas = (boletas) => {
    const afiliados = {};
    boletas.detalle_boletas.forEach((boleta) => {
      boleta.afiliados.forEach((afiliado) => {
        const cuil = afiliado.cuil;
        if (!afiliados[cuil]) {
          afiliados[cuil] = {
            apellido: afiliado.apellido,
            boletas: Array(boletas.detalle_boletas.length).fill(0),
            cuil: cuil,
            nombre: afiliado.nombre,
            remunerativo: afiliado.remunerativo,
          };
        }
        const index = boletas.detalle_boletas.findIndex(
          (detalle) => detalle.codigo === boleta.codigo,
        );
        afiliados[cuil].boletas[index] = afiliado.capital;
      });
    });
    const afiliadosArray = Object.values(afiliados);
    return afiliadosArray;
  };

  const setInteresInDetalleBoleta = (boletaIndex, response) => {
    const newDetalleBoletas = [...boletas.detalle_boletas];
    const fdp = newDetalleBoletas[boletaIndex].formaDePago;
    newDetalleBoletas[boletaIndex] = response;
    console.log(
      'setInteresInDetalleBoleta - newDetalleBoletas:',
      newDetalleBoletas,
    );
    console.log('setInteresInDetalleBoleta - response:', response);
    newDetalleBoletas[boletaIndex].formaDePago = fdp;
    setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
  };

  const checkFields = () => {
    boletas.detalle_boletas.forEach((boleta) => {
      if (boleta.intencionDePago === '') return true;
    });
    return false;
  };

  const setIntencionDePago = async (codigo, fecha, lanzar) => {
    const fechaToISO = new Date(`${fecha}`).toISOString();
    if (primeraSeleccion && lanzar) {
      if (!isUseEffect) {
        setPrimeraSeleccion(false);
      }
      if (isUseEffect) {
        setIsUseEffect(false);
      }

      console.log(ID_EMPRESA);
      console.log(DDJJ_ID);
      const response = await axiosGenerarBoletas.calcularInteresBoletas(
        ID_EMPRESA,
        DDJJ_ID,
        fechaToISO,
      );
      console.log(
        'setIntencionDePago - axiosGenerarBoletas.calcularInteresBoletas - response:',
        response,
      );

      if (response && response.detalle_boletas) {
        const updatedDetalleBoletas = response.detalle_boletas.map((boleta) => {
          const prevBoleta = boletas.detalle_boletas.find(
            (prevBoleta) => prevBoleta.codigo === boleta.codigo,
          );
          return {
            ...boleta,
            formaDePago: prevBoleta ? prevBoleta.formaDePago : 'VENTANILLA',
          };
        });
        setBoletas((prevBoletas) => ({
          ...prevBoletas,
          detalle_boletas: updatedDetalleBoletas,
        }));
        sethabilitaBoton(checkFields());
      }
    } else {
      const boletaIndex = boletas.detalle_boletas.findIndex(
        (element) => element.codigo === codigo,
      );
      const response = await axiosGenerarBoletas.calcularInteresBoleta(
        ID_EMPRESA,
        DDJJ_ID,
        codigo,
        fechaToISO,
      );
      console.log(response);
      if (response && response.ajustes && response.codigo) {
        setInteresInDetalleBoleta(boletaIndex, response);
        sethabilitaBoton(false);
      }
    }
  };

  const setFormaDePagoInBoleta = (boletaIndex, formaDePago) => {
    const newDetalleBoletas = [...boletas.detalle_boletas];
    newDetalleBoletas[boletaIndex] = {
      ...newDetalleBoletas[boletaIndex],
      formaDePago,
    };
    setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
  };

  const setFormaDePago = (codigo, value) => {
    if (primeraSeleccionFDP) {
      const newDetalleBoletas = boletas.detalle_boletas.map((boleta) => {
        //Condicion puesta hasta que se habilite el PagoMisCuentas en amtimacs
        if (boleta.codigo === 'AMTIMACS' && value == 'PMCUENTAS') {
          return boleta;
        }
        return {
          ...boleta,
          formaDePago: value,
        };
      });
      setBoletas({ ...boletas, detalle_boletas: newDetalleBoletas });
      setPrimeraSeleccionFDP(false);
    } else {
      const boletaIndex = boletas.detalle_boletas.findIndex(
        (element) => element.codigo === codigo,
      );
      setFormaDePagoInBoleta(boletaIndex, value);
    }
    sethabilitaBoton(false);
  };

  const toggleDetail = () => setShowDetail(!showDetail);

  const generarBoletas = async () => {
    try {
      sethabilitaBoton(true);
      setShowLoading(true);
      const data = await axiosGenerarBoletas.generarBoletasPost(
        ID_EMPRESA,
        DDJJ_ID,
        boletas,
      );
      console.log('Este es el response ', data);
      sethabilitaBoton(true);
      setShowLoading(false);
      if (data) {
        navigate(`/dashboard/boletas`);
      }
    } catch (error) {
      console.error(error);
      swal.showError(
        '!Ocurrio un problema. No se pudieron generar las Boletas de Pago',
      );
      navigate('/dashboard/boletas');
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="generador_boletas_container">
      <h1>Boleta de Pago</h1>
      <h3 style={{ color: '#1A76D2' }}>
        DDJJ:{' '}
        {boletas &&
        boletas.periodo &&
        boletas.periodo !== null &&
        boletas.periodo !== ''
          ? formatter.periodo(boletas.periodo)
          : ''}{' '}
        {boletas &&
        boletas.tipo_ddjj &&
        boletas.tipo_ddjj !== null &&
        boletas.tipo_ddjj !== ''
          ? boletas.tipo_ddjj
          : ''}{' '}
        - Generación Boletas de Pago
      </h3>
      <br></br>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="cwbcb"></TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell className="cwbcb importes" key={boleta.codigo}>
                    {boleta.descripcion}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Vencimiento</TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell className="importes" key={boleta.codigo}>
                    {boleta.vencimiento !== null && boleta.vencimiento !== ''
                      ? formatter.date(boleta.vencimiento)
                      : ''}
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell>Intención de Pago</TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell className="importes" key={boleta.codigo}>
                    <TextField
                      type="date"
                      inputProps={{ min: hoy }}
                      value={boleta.intencionDePago?.split('T')[0] || ''}
                      onChange={(event) =>
                        setIntencionDePago(
                          boleta.codigo,
                          event.target.value,
                          false,
                        )
                      }
                      onBlur={(event) => {
                        console.log(event.target.value);
                        setIntencionDePago(
                          boleta.codigo,
                          event.target.value,
                          true,
                        );
                      }}
                    />
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell>Forma de Pago</TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell className="importes" key={boleta.codigo}>
                    <Select
                      value={boleta.formaDePago || ''}
                      onChange={(event) =>
                        setFormaDePago(boleta.codigo, event.target.value)
                      }
                    >
                      {formasPago.map((reg) => {
                        if (
                          'AMTIMACS' !== boleta.codigo ||
                          'PMCUENTAS' !== reg.codigo
                        ) {
                          return (
                            <MenuItem key={reg.codigo} value={reg.codigo}>
                              {reg.descripcion}
                            </MenuItem>
                          );
                        }
                      })}
                    </Select>
                  </TableCell>
                ))}
            </TableRow>
            <TableRow style={{ marginTop: '2em' }}>
              <TableCell
                colSpan={
                  boletas.detalle_boletas
                    ? boletas.detalle_boletas.length + 1
                    : 1
                }
              >
                <Button onClick={() => toggleDetail(boletas.detalle_boletas)}>
                  {!showDetail && 'Mostrar detalle de afiliados'}
                  {showDetail && 'Ocultar detalle de afiliados'}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {showDetail && (
        <TableContainer
          component={Paper}
          style={{
            marginTop: 50,
            height: 400,
            width: '100%',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className="cwbcb" style={{ width: '5em' }}>
                  CUIL
                </TableCell>
                <TableCell className="cwbcb" style={{ width: '5em' }}>
                  Apellido
                </TableCell>
                <TableCell className="cwbcb importes" style={{ width: '20em' }}>
                  Remunerativo
                </TableCell>
                {boletas.detalle_boletas &&
                  boletas.detalle_boletas.map((boleta) => (
                    <TableCell
                      className="cwbcb importes"
                      style={{ width: '20em' }}
                      key={boleta.codigo}
                    >
                      {boleta.descripcion}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAfiliados.map((afiliado, index) => (
                <TableRow key={index} className={index % 2 === 0 ? '' : 'even'}>
                  <TableCell>{afiliado.cuil}</TableCell>
                  <TableCell>{afiliado.apellido}</TableCell>
                  <TableCell className="importes">
                    {formatter.currency.format(afiliado.remunerativo)}
                  </TableCell>
                  {afiliado.boletas.map((boleta, boletaIndex) => (
                    <TableCell className="importes" key={boletaIndex}>
                      {formatter.currency.format(boleta)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[50, 75, 100]}
            component="div"
            count={afiliados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <TableContainer component={Paper} style={{ marginTop: '3em' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="cwbcb"></TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell className="cwbcb importes" key={boleta.codigo}>
                    {boleta.descripcion}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="cwbcb">Total Acumulado</TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell key={boleta.codigo} className="importes">
                    {formatter.currency.format(boleta.total_acumulado)}
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell className="cwbcb">Interes</TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell key={boleta.codigo} className="importes">
                    {formatter.currency.format(boleta.interes)}
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell className="cwbcb" style={{ width: '24.5em' }}>
                Ajustes
              </TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell
                    className="importes"
                    style={{ width: '27.5em' }}
                    key={boleta.codigo}
                  >
                    {formatter.currency.format(
                      boleta.ajustes?.reduce(
                        (acumulador, ajuste) => acumulador + ajuste.monto,
                        0,
                      ),
                    )}
                  </TableCell>
                ))}
            </TableRow>
            <TableRow>
              <TableCell className="cwbcb">Total Final</TableCell>
              {boletas.detalle_boletas &&
                boletas.detalle_boletas.map((boleta) => (
                  <TableCell
                    key={boleta.codigo}
                    className="importes"
                    style={{ backgroundColor: 'lightblue' }}
                  >
                    {formatter.currency.format(boleta.total_final)}
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" paddingTop="5em">
        <ThreeCircles
          visible={showLoading}
          height="25"
          width="25"
          color="#1A76D2"
          ariaLabel="three-circles-loading"
        />
        <Button
          variant="contained"
          onClick={() => generarBoletas()}
          color="primary"
          disabled={habilitaBoton}
        >
          Generar
        </Button>
      </Box>

      {boletas.detalle_boletas &&
        boletas.detalle_boletas
          .filter((boleta) => boleta.ajustes?.length > 0)
          .map((boleta, index) => (
            <div key={index}>
              {index === 0 && (
                <h3 style={{ color: '#1A76D2' }}>Ajustes aplicados</h3>
              )}
              <p>{boleta.descripcion}</p>

              <ul>
                {boleta.ajustes.map((ajuste, index) => (
                  <li key={index}>
                    {ajuste.descripcion} - Motivo: {MOTIVOS_DESC[ajuste.motivo]}{' '}
                    - Monto:
                    {formatter.currency.format(ajuste.monto)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
    </div>
  );
};
