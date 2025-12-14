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
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import localStorageService from '@/components/localStorage/localStorageService';
import EmpresaAutocomplete from '../components/EmpresaAutocomplete';
import { calcularDetalleConvenio } from '../components/detalleHelper';
import {
  buscarEmpresaPorCuit,
  buscarEmpresaPorNombre,
  fetchEmpresaData,
  generarConvenio,
  actualizarConvenio,
} from '../components/empresaHelper';
import { crearBodyConvenio } from '../components/convenioHelper';
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

  const [empresa, setEmpresa] = useState(null); //Empresa a la que se gestionara la deuda.-
  const [empresas, setEmpresas] = useState([]); //Se usa para guardar las empresas que vienen del backend

  //const [empresa_id, setEmpresaId] = useState(null); //Se usa para guardar el id de la empresa
  const [cuitInput, setCuitInput] = useState(null); //Se usa para guardar el cuit de la empresa
  const [nombreEmpresa, setNombreEmpresa] = useState(null); //EmpresaAutocomplete: Se usa para guardar el nombre de la empresa
  const [loadEmpresaDetalle, setloadEmpresaDetalle] = useState(false); //Se usa para cargar todo el detalle de la deuda de la Empresa

  const [actas, setActas] = useState([]); //Se usa para guardar las actas que vienen del backend
  const [selectedActas, setSelectedActas] = useState([]); //Se usa para guardar los ids de las actas seleccionadas
  const [totalActas, setTotalActas] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [declaracionesJuradas, setDeclaracionesJuradas] = useState([]); //Se usa para guardar las declaracionesJuradas que vienen del backend
  const [selectedDeclaracionesJuradas, setSelectedDeclaracionesJuradas] =
    useState([]); //Se usa para guardar los ids de las declaracionesJuradas seleccionadas
  const [totalDeclaracionesJuradas, setTotalDeclaracionesJuradas] = useState(0); //Se usa para mostrar en la cabecera del acordion
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

  const fechaDelDia = new Date(); //Se usa para guardar la fecha del dia actual
  const rol = localStorageService.getRol(); //Se usa para guardar el rol del usuario
  console.log('Gestion - rol: ', rol);

  //Cargo Las Empresas del Back
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axiosGestionDeudas.getEmpresas();
        setEmpresas(response);
        console.log('Gestion - useEffect() - Empresas: ', response);
      } catch (error) {
        console.error(
          'Gestion - useEffect() - Error al obtener las empresas:',
          error,
        );
      }
    };
    fetchEmpresas();
  }, []);

  //Cargo La Empresa a trabajar
  useEffect(() => {
    console.log(
      'Gestion - useEffect() - [empresas, empresa, window.location.hash] - INIT',
    );

    var auxEmpresa = null;
    var auxEmpresaVec = null;
    var auxEmpresaCuit = null;
    var isEditar = false;

    if (localStorageService.isRolEmpleador()) {
      auxEmpresa = {};
      auxEmpresa.id = localStorageService.getEmpresaId();
      auxEmpresa.razonSocial = localStorageService.getEmpresaRazonSocial();
      auxEmpresa.cuit = localStorageService.getEmpresaCuit();
      setEmpresa(auxEmpresa);
    } else {
      //Editar-Consultar: Seteo la empresa del convenio a Editar-Consultar
      isEditar =
        window.location.hash.includes('/editar') ||
        window.location.hash.includes('/ver');

      if (isEditar) {
        const parts = window.location.hash.split('/');
        var auxEmpresaCuit = parts[parts.indexOf('cuit') + 1];

        setConvenioId(parts[parts.indexOf('convenio') + 1]);
        setCuitInput(auxEmpresaCuit);
        //Busco el cuit en el verctor de Empresas

        if (empresas && empresas.length > 0)
          auxEmpresaVec = empresas.find((e) => e.cuit === auxEmpresaCuit);

        if (auxEmpresaVec && auxEmpresaVec != null) {
          auxEmpresa = {};
          auxEmpresa.id = auxEmpresaVec.id;
          auxEmpresa.razonSocial = auxEmpresaVec.razonSocial;
          auxEmpresa.cuit = auxEmpresaVec.cuit;
          setEmpresa(auxEmpresa);
        }
      } else {
        if (
          cuitInput !== null &&
          window.location.hash !== '#/dashboard/gestiondeuda'
        ) {
          if (empresas && empresas.length > 0)
            auxEmpresaVec = empresas.find((e) => e.cuit === cuitInput);

          if (auxEmpresaVec && auxEmpresaVec != null) {
            auxEmpresa = {};
            auxEmpresa.id = auxEmpresaVec.id;
            auxEmpresa.razonSocial = auxEmpresaVec.razonSocial;
            auxEmpresa.cuit = auxEmpresaVec.cuit;
            setEmpresa(auxEmpresa);
          }
        } else {
          setEmpresa(null);
        }
      }
    }

    if (auxEmpresa && auxEmpresa != null) {
      fetchEmpresaData(
        isEditar,
        auxEmpresa.id, //auxIdEmpresa,
        ENTIDAD,
        axiosGestionDeudas,
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
        setSelectedDeclaracionesJuradas,
        setSelectedSaldosAFavor,
        setTotalDeuda,
        setloadEmpresaDetalle,
        setMedioPago,
      );
    }

    console.log(
      'Gestion - useEffect() - [empresas, window.location.hash] - window.location.hash: ',
      window.location.hash,
    );

    if (isEditar) {
      setIsCheckedEstadoDeDeduda(false);
    }
  }, [empresas, empresa, cuitInput, window.location.hash]);

  /*
  useEffect(() => {
    const isEditar = window.location.hash.includes('/editar');
    const isVer = window.location.hash.includes('/ver');
    if (!(isVer || isEditar) || !cuitInput || empresas.length === 0) {
      console.log('useEffect - [empresas, cuitInput] - ');
      console.log('useEffect - window.location: ', window.location);
      console.log('useEffect - cuitInput: ', cuitInput);
      console.log('useEffect - empresas: ', empresas);

      return;
    }

    var auxEmpresa = null;
    const auxEmpresaVec = empresas.find((e) => e.cuit === cuitInput);
    if (empresa) {
      auxEmpresa = {};
      auxEmpresa.id = auxEmpresaVec.id;
      auxEmpresa.razonSocial = auxEmpresaVec.razonSocial;
      auxEmpresa.cuit = auxEmpresaVec.cuit;
      setEmpresa(auxEmpresa);
    }
  }, [empresas, cuitInput]);
  */

  const buscarPorCuit = (valor) => {
    buscarEmpresaPorCuit({
      valor,
      empresas,
      axiosGestionDeudas,
      setEmpresa,
      fetchData: (editar, empresaId) =>
        fetchEmpresaData(
          editar,
          empresaId,
          ENTIDAD,
          axiosGestionDeudas,
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
          setSelectedDeclaracionesJuradas,
          setSelectedSaldosAFavor,
          setTotalDeuda,
          setloadEmpresaDetalle,
          setMedioPago,
        ),
    });
  };

  const buscarPorNombre = (valor) => {
    buscarEmpresaPorNombre({
      valor,
      empresas,
      axiosGestionDeudas,
      setEmpresa,
      fetchData: (editar, empresaId) =>
        fetchEmpresaData(
          editar,
          empresaId,
          ENTIDAD,
          axiosGestionDeudas,
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
          setSelectedDeclaracionesJuradas,
          setSelectedSaldosAFavor,
          setTotalDeuda,
          setloadEmpresaDetalle,
        ),
    });
  };

  const handleGenerarConvenio = async () => {
    setShowLoading(true);
    const bodyConvenio = crearBodyConvenio({
      ENTIDAD,
      cuotas,
      fechaIntencion,
      selectedActas,
      selectedDeclaracionesJuradas,
      selectedSaldosAFavor,
      medioPago,
    });
    //const empresa = ID_EMPRESA === "833" || ID_EMPRESA === null ? empresa_id : ID_EMPRESA; //TODO cambiar y probar con rol y no con 833

    var auxEmpresaId = null;
    if (empresa && empresa != null && empresa.id) {
      auxEmpresaId = empresa.id;
    }
    const ok = await generarConvenio(
      auxEmpresaId,
      bodyConvenio,
      axiosGestionDeudas,
      Swal,
      setShowLoading,
    );
    if (ok) {
      navigate('/dashboard/convenios');
    }
  };

  const handleActualizarConvenio = async () => {
    setShowLoading(true);
    const bodyConvenio = crearBodyConvenio({
      ENTIDAD,
      cuotas,
      fechaIntencion,
      selectedActas,
      selectedDeclaracionesJuradas,
      selectedSaldosAFavor,
      medioPago,
    });

    console.log('Gestion - handleActualizarConvenio - ', empresa);
    var auxEmpresaId = null;
    if (empresa && empresa != null && empresa.id) auxEmpresaId = empresa.id;
    const ok = await actualizarConvenio(
      auxEmpresaId,
      convenio_id,
      bodyConvenio,
      axiosGestionDeudas,
      Swal,
    );

    setShowLoading(false);
    if (ok) {
      navigate('/dashboard/convenios');
    }
  };

  useEffect(() => {
    setShowLoadingDetalle(true);
    if (isCheckedEstadoDeDeduda) {
      const idsActas = actas.map((objeto) => objeto.id);
      setSelectedActas(idsActas);
      const idsdeclaracionesJuradas = declaracionesJuradas.map(
        (objeto) => objeto.id,
      );
      setSelectedDeclaracionesJuradas(idsdeclaracionesJuradas);
      const idsSaldosAFavor = saldosAFavor.map((objeto) => objeto.id);
      setSelectedSaldosAFavor(idsSaldosAFavor);
      console.log('Estoy en el if de isCheckedEstadoDeDeduda');
    } else {
      setSelectedActas([]);
      setSelectedDeclaracionesJuradas([]);
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
      .filter((item) => selectedDeclaracionesJuradas.includes(item.id))
      .reduce((acc, item) => (acc += item.importeTotal), 0);

    setTotalDeclaracionesJuradas(BTotal);
    setShowLoadingDetalle(false);
  }, [selectedDeclaracionesJuradas, ENTIDAD]);

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
    //console.log(isVer, 'isVer')
    calcularDetalle();
  }, [
    selectedActas,
    selectedDeclaracionesJuradas,
    selectedSaldosAFavor,
    cuotas,
    fechaIntencion,
  ]);

  const handleChangeActas = (value) => {
    setSelectedActas(value);
    if (!shouldCalculate) setShouldCalculate(true);
  };
  const handleChangeDDJJ = (value) => {
    setSelectedDeclaracionesJuradas(value);
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
    const isVer = window.location.hash.includes('/ver');
    if (!isVer) {
      var auxEmpresaId = null;
      if (empresa && empresa != null) {
        auxEmpresaId = empresa.id;
      }
      const resultado = await calcularDetalleConvenio({
        declaracionesJuradas,
        selectedDeclaracionesJuradas,
        actas,
        selectedActas,
        saldosAFavor,
        selectedSaldosAFavor,
        cuotas,
        fechaIntencion,
        auxEmpresaId,
        axiosGestionDeudas,
      });

      setImporteDeDeuda(resultado.importeDeuda);
      setDetalleConvenio(resultado.detalle);
    }
  };

  return loadEmpresaDetalle ? (
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
        visible={loadEmpresaDetalle}
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
          nombreEmpresa={nombreEmpresa}
          setCuitInput={setCuitInput}
          setNombreEmpresa={setNombreEmpresa}
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
              isVer={window.location.hash.includes('/ver')}
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
                TOTAL: {formatter.currencyString(totalDeclaracionesJuradas)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GrillaPeriodo
              declaracionesJuradas={declaracionesJuradas}
              selectedDeclaracionesJuradas={selectedDeclaracionesJuradas}
              setSelectedDeclaracionesJuradas={handleChangeDDJJ}
              isVer={window.location.hash.includes('/ver')}
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
          isEditar={window.location.hash.includes('/editar')}
          isVer={window.location.hash.includes('/ver')}
          showLoading={showLoading}
        ></OpcionesDePago>
      </div>
    </div>
  );
};
