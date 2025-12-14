import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { UserContext } from '@/context/userContext';
import PropTypes from 'prop-types';
import { GrillaActas } from '../Grillas/GrillaActas';
import { GrillaPeriodo } from '../Grillas/GrillaPeriodos';
import { EstadoDeDeuda } from '../EstadoDeDeuda/EstadoDeDeuda';
import { OpcionesDePago } from '../OpcionesDePago/OpcionesDePago';
import { axiosGestionDeudas } from './GestionApi';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formatter from '@/common/formatter';
import { GrillaSaldoAFavor } from '../Grillas/GrillaSaldoAFavor';
import { useNavigate } from 'react-router-dom';
import localStorageService from '@/components/localStorage/localStorageService';
import EmpresaAutocomplete from '../components/EmpresaAutocomplete';
import detalleHelper from '../components/detalleHelper';
import empresaHelper from '../components/empresaHelper';
import conveniosHelper from '@/pages/dashboard/pages_dashboard/gestion_deudas/components/convenioHelper';
import { ThreeCircles } from 'react-loader-spinner';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const Gestion = ({ ENTIDAD }) => {
  useContext(UserContext);
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState([]); //Tabla Empresas del backend
  const [cargandoTablaEmpresas, setCargandoTablaEmpresas] = useState(false); //Se usa para cargar todas las empresas al inicio

  const [empresaId, setEmpresaId] = useState(null); //Se usa para guardar el id de la empresa
  const [empresaNombre, setEmpresaNombre] = useState(null); //Se usa para guardar el nombre de la empresa
  const [cuitInput, setCuitInput] = useState(null); //Rol UsuarioInterno: CUIT del Filtro/URL

  const [actas, setActas] = useState([]); //Se usa para guardar las actas que vienen del backend
  const [selectedActas, setSelectedActas] = useState([]); //Se usa para guardar los ids de las actas seleccionadas
  const [totalActas, setTotalActas] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [declaracionesJuradas, setDeclaracionesJuradas] = useState([]); //Se usa para guardar las declaracionesJuradas que vienen del backend
  const [selectedDDJJ, setSelectedDDJJ] = useState([]); //Se usa para guardar los ids de las declaracionesJuradas seleccionadas
  const [totalDDJJ, setTotalDDJJ] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [convenios, setConvenios] = useState([]); //Se usa para guardar los convenios que vienen del backend
  const [totalConvenios, setTotalConvenios] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [isCheckedEstadoDeDeduda, setIsCheckedEstadoDeDeduda] = useState(true); //Se utiliza para tildar o destildar todas las rows
  const [cuotas, setCuotas] = useState(1); //Se utiliza para guardar la cantidad de cuotas seleccionadas por el usuario
  const [fechaIntencion, setFechaIntencion] = useState(null); //Se utiliza para guardar la fecha de intencion de pago que con la que vamos a generar el convenio
  const [saldosAFavor, setSaldosAFavor] = useState([]);
  const [selectedSaldosAFavor, setSelectedSaldosAFavor] = useState([]);
  const [totalSaldosAFavor, setTotalSaldosAFavor] = useState(0);
  const [totalSaldosAFavorSelected, setTotalSaldosAFavorSelected] = useState(0); //Se usa para guardar el total de saldos a favor seleccionados
  const [detalleConvenio, setDetalleConvenio] = useState({}); //Propiedades del detalle convenio
  const [showLoading, setShowLoading] = useState(false); // Estado para mostrar el loading
  const [showLoadingDetalle, setShowLoadingDetalle] = useState(false); // Estado para mostrar el loading del detalle
  const [noUsar, setNoUsar] = useState(true); // Estado que identifica si se utiliza el saldo a favor o no
  const [medioPago, setMedioPago] = useState('CHEQUE'); //Queda por si en algun momento se agrega otro medio de pago
  const [totalDeuda, setTotalDeuda] = useState(0); //Se usa para mostrar el total de la deuda en el estado de deuda
  const [importeDeDeuda, setImporteDeDeuda] = useState(0); //Se usa para mostrar el importe de la deuda en el estado de deuda
  const [convenio_id, setConvenioId] = useState(null); //Se usa para guardar el id del convenio si se esta editando
  const [shouldCalculate, setShouldCalculate] = useState(
    !window.location.hash.includes('/editar'),
  );
  const [intereses, setIntereses] = useState(0); //Se usa para guardar los intereses de la deuda

  const fechaDelDia = new Date();

  //Carga todas las EMPRESAS del back
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axiosGestionDeudas.getEmpresas();
        setEmpresas(response);
        console.log('Empresas', response);
      } catch (error) {
        console.error('Error al obtener las empresas:', error);
      }
    };
    fetchEmpresas();
  }, []);

  //Evento onLoad, o bien si cambia la URL (Consulta Empleado Interno)
  useEffect(() => {
    console.log('Gestion - useEffect() - INIT');
    console.log('Gestion - useEffect() - empresas: ', empresas);
    console.log(
      'Gestion - useEffect() - window.location.hash: ',
      window.location.hash,
    );

    var auxCuitInput = null;
    var auxEmpresaNombre = null;
    var auxEmpresaId = null;
    var auxConvenioId = null;

    if (conveniosHelper.isEditarVer()) {
      const parts = window.location.hash.split('/');
      auxConvenioId = parts[parts.indexOf('convenio') + 1];
      auxCuitInput = parts[parts.indexOf('cuit') + 1];
    }

    if (empresas && empresas.length > 0) {
      if (localStorageService.isRolEmpleador()) {
        auxCuitInput = localStorageService.getEmpresaCuit();
      }

      if (auxCuitInput && auxCuitInput != null) {
        const auxEmpresa = buscarVecEmpresaPorCuit(auxCuitInput);
        if (auxEmpresa && auxEmpresa != null) {
          auxEmpresaId = auxEmpresa.id;
          auxEmpresaNombre = auxEmpresa.razonSocial;
        }
      }

      console.log('Gestion - useEffect() - auxConvenioId: ', auxConvenioId);
      console.log('Gestion - useEffect() - auxCuitInput: ', auxCuitInput);
      console.log('Gestion - useEffect() - auxEmpresaId: ', auxEmpresaId);
      console.log(
        'Gestion - useEffect() - auxEmpresaNombre: ',
        auxEmpresaNombre,
      );

      if (auxEmpresaId) {
        empresaHelper.fetchEmpresaData(
          conveniosHelper.isEditar(),
          conveniosHelper.isVer(),
          auxEmpresaId,
          ENTIDAD,
          setDetalleConvenio,
          setFechaIntencion,
          setIntereses,
          setImporteDeDeuda,
          setSaldosAFavor,
          setCuotas,
          setDeclaracionesJuradas,
          setActas,
          setConvenios,
          setSelectedActas,
          setSelectedDDJJ,
          setSelectedSaldosAFavor,
          setTotalDeuda,
          setCargandoTablaEmpresas,
          setMedioPago,
        );
      }
    }

    if (conveniosHelper.isEditarVer()) {
      setIsCheckedEstadoDeDeduda(false);
    }

    setEmpresaId(auxEmpresaId);
    setEmpresaNombre(auxEmpresaNombre);
    setCuitInput(auxCuitInput);
    setConvenioId(auxConvenioId);
  }, [empresas, window.location.hash]);

  //onload o Change de CUIT en Filtro
  useEffect(() => {
    if (!conveniosHelper.isEditarVer()) return;

    const auxEmpresa = buscarVecEmpresaPorCuit(cuitInput);
    if (auxEmpresa) {
      setEmpresaNombre(auxEmpresa.razonSocial);
      setEmpresaId(auxEmpresa.id);
    }
  }, [empresas, cuitInput]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    if (isCheckedEstadoDeDeduda) {
      const auxVecIdActa = actas.map((objeto) => objeto.id);
      setSelectedActas(auxVecIdActa);

      const auxVecIdDDJJ = declaracionesJuradas.map((objeto) => objeto.id);
      setSelectedDDJJ(auxVecIdDDJJ);

      const auxVecIdSaldosAFavor = saldosAFavor.map((objeto) => objeto.id);
      setSelectedSaldosAFavor(auxVecIdSaldosAFavor);

      console.log('useEffect() - isCheckedEstadoDeDeduda - Estoy en el if');
    } else {
      setSelectedActas([]);
      setSelectedDDJJ([]);
      setSelectedSaldosAFavor([]);
    }
    setShowLoadingDetalle(false);
  }, [isCheckedEstadoDeDeduda]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const ATotal = actas
      .filter((item) => selectedActas.includes(item.id))
      .reduce(
        (acc, item) =>
          (acc += item.estadoDeuda !== 'JUDICIALIZADO' ? item.importeTotal : 0),
        0,
      );

    setTotalActas(ATotal);

    setShowLoadingDetalle(false);
  }, [selectedActas]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const BTotal = declaracionesJuradas
      .filter((item) => selectedDDJJ.includes(item.id))
      .reduce((acc, item) => (acc += item.importeTotal), 0);

    setTotalDDJJ(BTotal);
    setShowLoadingDetalle(false);
  }, [selectedDDJJ, ENTIDAD]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const CTotal = saldosAFavor.reduce((acc, item) => (acc += item.importe), 0);

    setTotalSaldosAFavor(CTotal);
    setShowLoadingDetalle(false);
  }, [saldosAFavor, ENTIDAD]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const totalSaldosAFavorSelecteds = saldosAFavor
      .filter((item) => selectedSaldosAFavor.includes(item.id))
      .reduce((acc, item) => (acc += item.importe), 0);

    setTotalSaldosAFavorSelected(totalSaldosAFavorSelecteds);
    setShowLoadingDetalle(false);
  }, [selectedSaldosAFavor, ENTIDAD]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    if (convenios) {
      const CTotal = convenios.reduce(
        (acc, item) => (acc += item.totalActualizado),
        0,
      );

      setTotalConvenios(CTotal);
    }
    setShowLoadingDetalle(false);
  }, [convenios]);

  useEffect(() => {
    const totalDeudaCalculada =
      declaracionesJuradas.reduce(
        (acc, dj) => acc + (dj.importeTotal || 0),
        0,
      ) + actas.reduce((acc, acta) => acc + (acta.importeTotal || 0), 0);
    setTotalDeuda(totalDeudaCalculada);
  }, [ENTIDAD, declaracionesJuradas, actas]);

  useEffect(() => {
    if (!shouldCalculate) return;
    calcularDetalle();
  }, [
    selectedActas,
    selectedDDJJ,
    selectedSaldosAFavor,
    cuotas,
    fechaIntencion,
  ]);

  const buscarPorCuit = (valor) => {
    empresaHelper.buscarEmpresaPorCuit({
      valor,
      empresas,
      setEmpresaId,
      setNombreEmpresa: setEmpresaNombre,
      fetchData: (editar, empresaId) =>
        empresaHelper.fetchEmpresaData(
          editar,
          null,
          empresaId,
          ENTIDAD,
          setDetalleConvenio,
          setFechaIntencion,
          setIntereses,
          setImporteDeDeuda,
          setSaldosAFavor,
          setCuotas,
          setDeclaracionesJuradas,
          setActas,
          setConvenios,
          setSelectedActas,
          setSelectedDDJJ,
          setSelectedSaldosAFavor,
          setTotalDeuda,
          setCargandoTablaEmpresas,
          setMedioPago,
        ),
    });
  };

  const buscarPorNombre = (valor) => {
    empresaHelper.buscarEmpresaPorNombre({
      valor,
      empresas,
      setEmpresaId,
      setCuitInput,
      fetchData: (editar, empresaId) =>
        empresaHelper.fetchEmpresaData(
          editar,
          null,
          empresaId,
          ENTIDAD,
          setDetalleConvenio,
          setFechaIntencion,
          setIntereses,
          setImporteDeDeuda,
          setSaldosAFavor,
          setCuotas,
          setDeclaracionesJuradas,
          setActas,
          setConvenios,
          setSelectedActas,
          setSelectedDDJJ,
          setSelectedSaldosAFavor,
          setTotalDeuda,
          setCargandoTablaEmpresas,
        ),
    });
  };

  const handleGenerarConvenio = async () => {
    setShowLoading(true);
    const bodyConvenio = conveniosHelper.crearBodyConvenio({
      ENTIDAD,
      cuotas,
      fechaIntencion,
      selectedActas,
      selectedDeclaracionesJuradas: selectedDDJJ,
      selectedSaldosAFavor,
      medioPago,
    });
    const ok = await empresaHelper.generarConvenio(
      empresaId,
      bodyConvenio,
      setShowLoading,
    );
    if (ok) {
      navigate('/dashboard/convenios');
    }
  };

  const handleActualizarConvenio = async () => {
    setShowLoading(true);
    const bodyConvenio = conveniosHelper.crearBodyConvenio({
      ENTIDAD,
      cuotas,
      fechaIntencion,
      selectedActas,
      selectedDeclaracionesJuradas: selectedDDJJ,
      selectedSaldosAFavor,
      medioPago,
    });
    console.log(empresaId);
    const ok = await empresaHelper.actualizarConvenio(
      empresaId,
      convenio_id,
      bodyConvenio,
    );
    setShowLoading(false);
    if (ok) {
      navigate('/dashboard/convenios');
    }
  };

  const handleChangeActas = (value) => {
    setSelectedActas(value);
    if (!shouldCalculate) setShouldCalculate(true);
  };
  const handleChangeDDJJ = (value) => {
    setSelectedDDJJ(value);
    if (!shouldCalculate) setShouldCalculate(true);
  };
  const handleChangeSaldo = (value) => {
    setSelectedSaldosAFavor(value);
    if (!shouldCalculate) setShouldCalculate(true);
  };
  const handleChangeCuotas = (value) => {
    setCuotas(value);
    if (!shouldCalculate) setShouldCalculate(true);
  };
  const handleChangeFecha = (value) => {
    setFechaIntencion(value);
    if (!shouldCalculate) setShouldCalculate(true);
  };

  const calcularDetalle = async () => {
    if (!conveniosHelper.isVer()) {
      const resultado = await detalleHelper.calcularDetalleConvenio({
        declaracionesJuradas,
        selectedDeclaracionesJuradas: selectedDDJJ,
        actas,
        selectedActas,
        saldosAFavor,
        selectedSaldosAFavor,
        cuotas,
        fechaIntencion,
        empresaId,
      });

      setImporteDeDeuda(resultado.importeDeuda);
      setDetalleConvenio(resultado.detalle);
    }
  };

  const buscarVecEmpresaPorCuit = (value) => {
    if (!value || value == null) return null;
    if (!empresas || empresas == null) return null;
    return empresas.find((e) => e.cuit === value);
  };

  return cargandoTablaEmpresas ? (
    <div
      className="container_grilla"
      style={{
        height: '50vh', // o una altura razonable
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <p style={{ marginBottom: '1em' }}>Cargando empresas...</p>
      <ThreeCircles
        visible={cargandoTablaEmpresas}
        height="100"
        width="100"
        color="#1A76D2"
        ariaLabel="three-circles-loading"
      />
    </div>
  ) : (
    <div className="container_grilla">
      {!localStorageService.isRolEmpleador() && (
        <EmpresaAutocomplete
          empresas={empresas}
          cuitInput={cuitInput}
          nombreEmpresa={empresaNombre}
          setCuitInput={setCuitInput}
          setNombreEmpresa={setEmpresaNombre}
          buscarPorCuit={buscarPorCuit}
          buscarPorNombre={buscarPorNombre}
        />
      )}

      <div className="mb-4em">
        <EstadoDeDeuda
          isCheckedEstadoDeDeduda={isCheckedEstadoDeDeduda}
          setIsCheckedEstadoDeDeduda={setIsCheckedEstadoDeDeduda}
          fecha_total={fechaDelDia ? formatter.dateString(fechaDelDia) : ''}
          deuda={totalDeuda}
          saldo_a_favor={totalSaldosAFavor}
        ></EstadoDeDeuda>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="primary">
                Actas
              </Typography>
              <Typography variant="h6" color="primary">
                TOTAL: {formatter.currencyString(totalActas)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GrillaActas
              actas={actas}
              selectedActas={selectedActas}
              setSelectedActas={handleChangeActas}
              isVer={conveniosHelper.isVer()}
              cuit={cuitInput}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="primary">
                Periodos
              </Typography>
              <Typography variant="h6" color="primary">
                TOTAL: {formatter.currencyString(totalDDJJ)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GrillaPeriodo
              declaracionesJuradas={declaracionesJuradas}
              selectedDeclaracionesJuradas={selectedDDJJ}
              setSelectedDeclaracionesJuradas={handleChangeDDJJ}
              isVer={conveniosHelper.isVer()}
              cuit={cuitInput}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="primary">
                Saldos a favor
              </Typography>
              <Typography variant="h6" color="primary">
                TOTAL: {formatter.currencyString(totalSaldosAFavorSelected)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GrillaSaldoAFavor
              saldoAFavor={saldosAFavor}
              selectedSaldosAFavor={selectedSaldosAFavor}
              setSelectedSaldosAFavor={handleChangeSaldo}
              cuit={cuitInput}
            />
          </AccordionDetails>
        </Accordion>
        <OpcionesDePago
          cuitInput={cuitInput}
          cuotas={cuotas}
          intereses={intereses}
          setIntereses={setIntereses}
          setCuotas={handleChangeCuotas}
          fechaIntencion={fechaIntencion}
          setMedioPago={setMedioPago}
          setFechaIntencion={handleChangeFecha}
          saldoAFavor={formatter.currencyString(totalSaldosAFavorSelected)}
          noUsar={noUsar}
          setNoUsar={setNoUsar}
          medioPago={medioPago}
          importeDeDeuda={importeDeDeuda}
          setImporteDeDeuda={setImporteDeDeuda}
          detalleConvenio={detalleConvenio}
          saldoAFavorUtilizado={totalSaldosAFavorSelected}
          handleGenerarConvenio={handleGenerarConvenio}
          handleActualizarConvenio={handleActualizarConvenio}
          isEditar={conveniosHelper.isEditar()}
          isVer={conveniosHelper.isVer()}
          showLoading={showLoading}
        ></OpcionesDePago>
      </div>
    </div>
  );
};
