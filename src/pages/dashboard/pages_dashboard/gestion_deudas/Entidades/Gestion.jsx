import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { UserContext } from '@/context/userContext';
import PropTypes from 'prop-types';
import { GrillaActas } from '../Grillas/GrillaActas';
import { GrillaConvenio } from '../Grillas/GrillaConvenio';
import { GrillaPeriodo } from '../Grillas/GrillaPeriodos';
import { EstadoDeDeuda } from '../EstadoDeDeuda/EstadoDeDeuda';
import { OpcionesDePago } from '../OpcionesDePago/OpcionesDePago';
import { axiosGestionDeudas } from './GestionApi';
import moment from 'moment';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formatter from '@/common/formatter';
import { GrillaSaldoAFavor } from '../Grillas/GrillaSaldoAFavor';
import Swal from 'sweetalert2';
import { generarConvenio } from './GestionApi';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

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

export const Gestion = ({ ID_EMPRESA, ENTIDAD }) => {
  useContext(UserContext);
  const navigate = useNavigate();
  const [actas, setActas] = useState([]); //Se usa para guardar las actas que vienen del backend
  const [selectedActas, setSelectedActas] = useState([]); //Se usa para guardar los ids de las actas seleccionadas
  const [totalActas, setTotalActas] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [declaracionesJuradas, setDeclaracionesJuradas] = useState([]); //Se usa para guardar las declaracionesJuradas que vienen del backend
  const [selectedDeclaracionesJuradas, setSelectedDeclaracionesJuradas] = useState([]); //Se usa para guardar los ids de las declaracionesJuradas seleccionadas
  const [totalDeclaracionesJuradas, setTotalDeclaracionesJuradas] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [convenios, setConvenios] = useState([]); //Se usa para guardar los convenios que vienen del backend
  const [totalConvenios, setTotalConvenios] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [isCheckedEstadoDeDeduda, setIsCheckedEstadoDeDeduda] = useState(true); //Se utiliza para tildar o destildar todas las rows
  const [cuotas, setCuotas] = useState(1); //Se utiliza para guardar la cantidad de cuotas seleccionadas por el usuario
  const [fechaIntencion, setFechaIntencion] = useState(null); //Se utiliza para guardar la fecha de intencion de pago que con la que vamos a generar el convenio
  const [saldosAFavor, setSaldosAFavor] = useState([])
  const [selectedSaldosAFavor, setSelectedSaldosAFavor] = useState([])
  const [totalSaldosAFavor, setTotalSaldosAFavor] = useState(0)
  const [totalSaldosAFavorSelected, setTotalSaldosAFavorSelected] = useState(0); //Se usa para guardar el total de saldos a favor seleccionados
  const [detalleConvenio, setDetalleConvenio] = useState({
    importeDeDeuda: 0,
    interesesDeFinanciacion: 0,
    saldoAFavor: 0,
    saldoAFavorUtilizado: 0,
    totalAPagar: 0,
    cantidadCuotas: 0,
    detalleCuota: [],
  }); //Propiedades del detalle convenio
  const [showLoading, setShowLoading] = useState(false); // Estado para mostrar el loading
  const [showLoadingDetalle, setShowLoadingDetalle] = useState(false); // Estado para mostrar el loading del detalle
  const [noUsar, setNoUsar] = useState(true); // Estado que identifica si se utiliza el saldo a favor o no
  const [medioPago, setMedioPago] = useState('CHEQUE'); //Queda por si en algun momento se agrega otro medio de pago
  const [totalDeuda, setTotalDeuda] = useState(0); //Se usa para mostrar el total de la deuda en el estado de deuda
  const [importeDeDeuda, setImporteDeDeuda] = useState(0); //Se usa para mostrar el importe de la deuda en el estado de deuda
  const [fechaDelDia, setFechaDelDia] = useState(null); //Se usa para guardar la fecha del dia actual
  const [convenio_id, setConvenioId] = useState(null); //Se usa para guardar el id del convenio si se esta editando

  useEffect(() => {
    const isEditar = window.location.hash.includes('/editar');
    console.log('isEditar:', isEditar);
    if (isEditar) {
      //const hash = window.location.hash; // Ejemplo: #/dashboard/gestiondeuda/3/editar/UOMA
      const parts = window.location.hash.split('/');
      console.log(parts[parts.indexOf('convenio') + 1])
      setConvenioId(parts[parts.indexOf('convenio') + 1]);
    }
    setFechaDelDia(new Date());
    fetchData(isEditar)
    if (isEditar) {
      setIsCheckedEstadoDeDeduda(false);
      console.log('Estoy en editar')
      const idsActas = actas
        .filter((objeto) => objeto.convenioActaId)
        .map((objeto) => objeto.id);
      setSelectedActas(idsActas);

      const idsDeclaracionesJuradas = declaracionesJuradas
        .filter((objeto) => objeto.convenioDdjjId)
        .map((objeto) => objeto.id);
      setSelectedDeclaracionesJuradas(idsDeclaracionesJuradas);

      const idsSaldosAFavor = saldosAFavor
        .filter((objeto) => objeto.convenioSaldoAFavorId)
        .map((objeto) => objeto.id);
      setSelectedSaldosAFavor(idsSaldosAFavor);
    }
    ;
  }, []);
  /*
    useEffect(() => {
      calcularDetalle();
    }, [selectedActas, selectedDeclaracionesJuradas, selectedSaldosAFavor, cuotas, fechaIntencion]);
  */
  const handleGenerarConvenio = async () => {

    setShowLoading(true);
    const bodyConvenio = {
      entidad: ENTIDAD,
      cantidadCuota: cuotas,
      fechaPago: fechaIntencion ? fechaIntencion.format("YYYY-MM-DD") : null,
      actas: selectedActas,
      ddjjs: selectedDeclaracionesJuradas,
      ajustes: selectedSaldosAFavor,
    };

    const camposNulos = Object.entries(bodyConvenio)
      .filter(([clave, valor]) => valor === null)
      .map(([clave]) => clave);

    if (camposNulos.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Por favor, complete todos los campos requeridos: ${camposNulos.join(', ')}`,
        confirmButtonText: 'Aceptar',
      });
      setShowLoading(false);
    } else {
      console.log("Todos los valores están definidos.");
      console.log('Body Convenio:', bodyConvenio);
      console.log('ID_EMPRESA:', ID_EMPRESA);
      const response = await generarConvenio(ID_EMPRESA, bodyConvenio);
      if (response === true) {
        Swal.fire({
          icon: 'success',
          title: '¡Convenio generado!',
          text: 'Serás redirigido al resumen',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard/convenios');
          }
        });
      }
      setShowLoading(false);

    }
  };

  const handleActualizarConvenio = async () => {
    setShowLoading(true);
    const bodyConvenio = {
      entidad: ENTIDAD,
      cantidadCuota: cuotas,
      fechaPago: fechaIntencion ? fechaIntencion.format("YYYY-MM-DD") : null,
      actas: selectedActas,
      ddjjs: selectedDeclaracionesJuradas,
      ajustes: selectedSaldosAFavor,
    };
    const camposNulos = Object.entries(bodyConvenio)
      .filter(([clave, valor]) => valor === null)
      .map(([clave]) => clave);
    if (camposNulos.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Por favor, complete todos los campos requeridos: ${camposNulos.join(', ')}`,
        confirmButtonText: 'Aceptar',
      });
      setShowLoading(false);
    } else {
      console.log("Todos los valores están definidos.");
      console.log('Body Convenio:', bodyConvenio);
      console.log('ID_EMPRESA:', ID_EMPRESA);
      console.log('CONVENIOID:', convenio_id);
      await axiosGestionDeudas.putActualizarConvenio(ID_EMPRESA, convenio_id, bodyConvenio);

      setShowLoading(false);
    }
  };

  useEffect(() => {
    //TODO: cuando este evento se dispare se deben setear todas las selected declaracionesJuradas y todas las actas en sus
    // respectivos arreglos
    setShowLoadingDetalle(true);
    if (isCheckedEstadoDeDeduda) {
      const idsActas = actas.map((objeto) => objeto.id);
      setSelectedActas(idsActas);
      const idsdeclaracionesJuradas = declaracionesJuradas.map((objeto) => objeto.id);
      setSelectedDeclaracionesJuradas(idsdeclaracionesJuradas);
      const idsSaldosAFavor = saldosAFavor.map((objeto) => objeto.id);
      setSelectedSaldosAFavor(idsSaldosAFavor)
      console.log('Estoy en el if de isCheckedEstadoDeDeduda')
    }

    else {
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
      .reduce((acc, item) => (acc += item.estadoDeuda !== 'JUDICIALIZADO' ? item.importeTotal : 0), 0);
    console.log('Esto es lo que se tendria que imprimir', ATotal);
    setTotalActas(ATotal);
    console.log(selectedActas)
    setShowLoadingDetalle(false);
  }, [selectedActas]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const BTotal = declaracionesJuradas
      .filter((item) => selectedDeclaracionesJuradas.includes(item.id))
      .reduce((acc, item) => (acc += item.importeTotal), 0);
    console.log('Esto es lo que se tendria que imprimir', BTotal);
    console.log(selectedDeclaracionesJuradas)
    setTotalDeclaracionesJuradas(BTotal);
    setShowLoadingDetalle(false);
  }, [selectedDeclaracionesJuradas, ENTIDAD]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const CTotal = saldosAFavor
      .reduce((acc, item) => (acc += item.importe), 0);
    console.log('Esto es lo que se tendria que imprimir', CTotal);
    setTotalSaldosAFavor(CTotal);
    setShowLoadingDetalle(false);
  }, [saldosAFavor, ENTIDAD]);

  useEffect(() => {
    setShowLoadingDetalle(true);
    const totalSaldosAFavorSelecteds = saldosAFavor
      .filter((item) => selectedSaldosAFavor.includes(item.id))
      .reduce((acc, item) => (acc += item.importe), 0);
    console.log('Esto es lo que se tendria que imprimir', totalSaldosAFavorSelecteds);
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
      console.log('Esto es lo que se tendria que imprimir', CTotal);
      setTotalConvenios(CTotal);
    }
    setShowLoadingDetalle(false);


  }, [convenios]);

  const fetchData = async (editar) => {

    try {
      console.log(ID_EMPRESA);
      console.log(ENTIDAD);
      let response;
      console.log('fetchData - editar:', editar);
      console.log('fetchData - convenio_id:', convenio_id);
      if (!editar) {
        response = await axiosGestionDeudas.getDeclaracionesJuradas(
          ID_EMPRESA,
          ENTIDAD,
        );
      } else {
        const parts = window.location.hash.split('/');
        //console.log(parts[parts.indexOf('convenio') + 1])
        const CONVENIOID = parts[parts.indexOf('convenio') + 1];
        response = await axiosGestionDeudas.getDeclaracionesJuradasEditar(
          ID_EMPRESA,
          CONVENIOID
        );
        console.log('Estoy en editar');
        console.log('response:', response);
      }

      console.log(response)


      calcularDetalle();

      console.log('axiosdeclaracionesJuradas.getDeclaracionesJuradas - response:', response);

      console.log(response['declaracionesJuradas'])

      //console.log('fecha de intencion de pago: ', dayjs(response.intencionPago))
      if (response.intencionPago) {
        setFechaIntencion(response.intencionPago ? moment(response.intencionPago) : null);
      }
      if (response.cuotas) {
        setCuotas(response.cuotas);
      } else {
        setCuotas(1);
      }

      setDeclaracionesJuradas(response['declaracionesJuradas']);
      setActas(response['actas']);
      setConvenios(response['convenios']);
      setSaldosAFavor(response['saldosAFavor'])


      const idsActas = response['actas'].map((objeto) => objeto.id);
      setSelectedActas(idsActas);



      if (editar) {
        const preselectedActas = response['actas']
          .filter((item) => item.convenioActaId !== null && item.convenioActaId !== undefined)
          .map((item) => item.id);

        if (preselectedActas.length > 0 && preselectedActas.some(id => !selectedActas.includes(id))) {
          setSelectedActas((prev) => Array.from(new Set([...prev, ...preselectedActas])));
        }
        console.log('Preselected IDs:', preselectedActas);

        const preselected = response['declaracionesJuradas']
          .filter((item) => item.convenioDdjjId !== null && item.convenioDdjjId !== undefined)
          .map((item) => item.id);

        if (preselected.length > 0 && preselected.some(id => !selectedDeclaracionesJuradas.includes(id))) {
          setSelectedDeclaracionesJuradas((prev) => Array.from(new Set([...prev, ...preselected])));
        }
        console.log(response['declaracionesJuradas'])
        console.log('Preselected IDs:', preselected);

        const preselectedAjustes = response['saldosAFavor']
          .filter((item) => item.convenioAjusteId !== null && item.convenioAjusteId !== undefined)
          .map((item) => item.id);

        if (preselectedAjustes.length > 0 && preselectedAjustes.some(id => !selectedDeclaracionesJuradas.includes(id))) {
          setSelectedSaldosAFavor((prev) => Array.from(new Set([...prev, ...preselectedAjustes])));
        }
        console.log('PreselectedAjustes IDs:', preselectedAjustes);
      } else {
        const idsActas = response['actas'].map((objeto) => objeto.id);
        setSelectedActas(idsActas);

        const idsdeclaracionesJuradas = response['declaracionesJuradas'].map((objeto) => objeto.id);
        setSelectedDeclaracionesJuradas(idsdeclaracionesJuradas);

        const idSelectedSaldosAFavor = response['saldosAFavor'].map((objeto) => objeto.id);
        setSelectedSaldosAFavor(idSelectedSaldosAFavor);
        //console.log(idSelectedSaldosAFavor)
      }



      console.log(response['saldosAFavor'])
      //setSelectedSaldosAFavor(idSelectedSaldosAFavor);
      console.log(selectedSaldosAFavor)

      const totalDeudaCalculada =
        response['declaracionesJuradas'].reduce((acc, dj) => acc + (dj.importeTotal || 0), 0) +
        response['actas'].reduce((acc, acta) => acc + (acta.importeTotal || 0), 0);
      setTotalDeuda(totalDeudaCalculada);
      //setSaldoAFavor(response['saldoAFavor']);
    } catch (error) {
      console.error('Error al obtener las declaracionesJuradas: ', error);
    }
  };

  useEffect(() => {
    const totalDeudaCalculada =
      declaracionesJuradas.reduce((acc, dj) => acc + (dj.importeTotal || 0), 0) +
      actas.reduce((acc, acta) => acc + (acta.importeTotal || 0), 0);
    setTotalDeuda(totalDeudaCalculada);
  }, [ENTIDAD, declaracionesJuradas, actas]);

  useEffect(() => {
    calcularDetalle();
  }, [selectedActas, selectedDeclaracionesJuradas, selectedSaldosAFavor, cuotas, fechaIntencion]);

  const calcularDetalle = async () => {
    try {


      const sumaDeclaracionesJuradas = declaracionesJuradas
        .filter((dj) => selectedDeclaracionesJuradas.includes(dj.id))
        .reduce((acc, dj) => acc + (dj.importeTotal || 0), 0);

      const sumaActas = actas
        .filter((acta) => selectedActas.includes(acta.id))
        .reduce((acc, acta) => acc + (acta.importeTotal || 0), 0);

      const sumaSaldosAFavor = saldosAFavor
        .filter((saldo) => selectedSaldosAFavor.includes(saldo.id))
        .reduce((acc, saldo) => acc + (saldo.importe || 0), 0);

      console.log('Suma importeTotal declaraciones juradas seleccionadas:', sumaDeclaracionesJuradas);
      console.log('Suma importeTotal actas seleccionadas:', sumaActas);
      console.log('Suma importe saldos a favor seleccionados:', sumaSaldosAFavor);
      setImporteDeDeuda(sumaDeclaracionesJuradas + sumaActas);


      const body = {
        "importeDeuda": sumaDeclaracionesJuradas + sumaActas - sumaSaldosAFavor,
        "cantidadCuota": cuotas,
        "fechaIntencionPago": fechaIntencion
          ? fechaIntencion.format("YYYY-MM-DD")
          : null,
      }
      const response = await axiosGestionDeudas.getDetalleConvenio(
        ID_EMPRESA,
        body,
      );



      setDetalleConvenio(response);
    } catch (error) {
      console.error('Error al calcular el detalle: ', error);
    }
  };


  return (
    <div className="container_grilla">
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
              setSelectedActas={setSelectedActas}
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
              setSelectedDeclaracionesJuradas={setSelectedDeclaracionesJuradas}
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
              setSelectedSaldosAFavor={setSelectedSaldosAFavor}
            />
          </AccordionDetails>
        </Accordion>

        <OpcionesDePago
          cuotas={cuotas}
          setCuotas={setCuotas}
          fechaIntencion={fechaIntencion}
          setFechaIntencion={setFechaIntencion}
          saldoAFavor={formatter.currencyString(totalSaldosAFavorSelected)}
          noUsar={noUsar}
          setNoUsar={setNoUsar}
          medioPago={medioPago}
          importeDeDeuda={importeDeDeuda}
          detalleConvenio={detalleConvenio}
          saldoAFavorUtilizado={totalSaldosAFavorSelected}
          handleGenerarConvenio={handleGenerarConvenio}
          handleActualizarConvenio={handleActualizarConvenio}
          isEditar={window.location.hash.includes('/editar')}
          showLoading={showLoading}
        ></OpcionesDePago>
      </div>
    </div>
  );
};
