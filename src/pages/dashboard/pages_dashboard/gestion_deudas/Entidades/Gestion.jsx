import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { UserContext } from '@/context/UserContext';
import PropTypes from 'prop-types';
import { GrillaActas } from '../Grillas/GrillaActas';
import { GrillaConvenio } from '../Grillas/GrillaConvenio';
import { GrillaPeriodo } from '../Grillas/GrillaPeriodos';
import { EstadoDeDeuda } from '../EstadoDeDeuda/EstadoDeDeuda';
import { OpcionesDePago } from '../OpcionesDePago/OpcionesDePago';
import { axiosGestionDeudas } from './GestionApi';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formatter from '@/common/formatter';

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
  const [actas, setActas] = useState([]); //Se usa para guardar las actas que vienen del backend
  const [selectedActas, setSelectedActas] = useState([]); //Se usa para guardar los ids de las actas seleccionadas
  const [totalActas, setTotalActas] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [boletas, setBoletas] = useState([]); //Se usa para guardar las boletas que vienen del backend
  const [selectedBoletas, setSelectedBoletas] = useState([]); //Se usa para guardar los ids de las boletas seleccionadas
  const [totalBoletas, setTotalBoletas] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [convenios, setConvenios] = useState([]); //Se usa para guardar los convenios que vienen del backend
  const [totalConvenios, setTotalConvenios] = useState(0); //Se usa para mostrar en la cabecera del acordion
  const [isCheckedEstadoDeDeduda, setIsCheckedEstadoDeDeduda] = useState(true); //Se utiliza para tildar o destildar todas las rows
  const [cuotas, setCuotas] = useState(1); //Se utiliza para guardar la cantidad de cuotas seleccionadas por el usuario
  const [fechaIntencion, setFechaIntencion] = useState(null); //Se utiliza para guardar la fecha de intencion de pago que con la que vamos a generar el convenio
  const [detalleConvenio, setDetalleConvenio] = useState({
    importeDeDeuda: 0,
    interesesDeFinanciacion: 0,
    saldoAFavor: 0,
    saldoAFavorUtilizado: 0,
    totalAPagar: 0,
    cantidadCuotas: 0,
    detalleCuota: [],
  }); //Propiedades del detalle convenio

  const [noUsar, setNoUsar] = useState(true); // Estado que identifica si se utiliza el saldo a favor o no
  const [medioPago, setMedioPago] = useState('CHEQUE'); //Queda por si en algun momento se agrega otro medio de pago

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    //TODO: cuando este evento se dispare se deben setear todas las selected boletas y todas las actas en sus
    // respectivos arreglos
    if (isCheckedEstadoDeDeduda) {
      const idsActas = actas.map((objeto) => objeto.id);
      setSelectedActas(idsActas);
      const idsBoletas = boletas.map((objeto) => objeto.id);
      setSelectedBoletas(idsBoletas);
    } else {
      setSelectedActas([]);
      setSelectedBoletas([]);
    }
  }, [isCheckedEstadoDeDeduda]);

  useEffect(() => {
    //
  }, [selectedActas, selectedBoletas, fechaIntencion, noUsar]);

  useEffect(() => {
    const ATotal = actas
      .filter((item) => selectedActas.includes(item.id))
      .reduce((acc, item) => (acc += item.importeTotal), 0);
    console.log('Esto es lo que se tendria que imprimir', ATotal);
    setTotalActas(ATotal);
  }, [selectedActas]);

  useEffect(() => {
    const BTotal = boletas
      .filter((item) => selectedBoletas.includes(item.id))
      .reduce((acc, item) => (acc += item.total_final), 0);
    console.log('Esto es lo que se tendria que imprimir', BTotal);
    setTotalBoletas(BTotal);
  }, [selectedBoletas]);

  useEffect(() => {
    const CTotal = convenios.reduce(
      (acc, item) => (acc += item.totalActualizado),
      0,
    );
    console.log('Esto es lo que se tendria que imprimir', CTotal);
    setTotalConvenios(CTotal);
  }, [convenios]);

  const fetchData = async () => {
    try {
      console.log(ID_EMPRESA);
      console.log(ENTIDAD);
      const response = await axiosGestionDeudas.getBoletas(
        ID_EMPRESA,
        ENTIDAD,
      );
      calcularDetalle();

      console.log('axiosBoletas.getBoletasEmpresa - response:', response);

      setBoletas(response['boletas']);
      setActas(response['actas']);
      setConvenios(response['convenios']);

      const idsActas = response['actas'].map((objeto) => objeto.id);
      setSelectedActas(idsActas);

      const idsBoletas = response['boletas'].map((objeto) => objeto.id);
      setSelectedBoletas(idsBoletas);

      //setSaldoAFavor(response['saldoAFavor']);
    } catch (error) {
      console.error('Error al obtener las boletas: ', error);
    }
  };

  const calcularDetalle = async () => {
    try {
      const body = {
        entidad: 'UOMA',
        actas: selectedActas,
        boletas: selectedBoletas,
        convenios: convenios.map((convenio) => convenio.id),
        cuotas: 2,
        medioDePago: 'CHEQUE',
        usarSaldoAFavor: true,
      };

      const response = await axiosGestionDeudas.getDetalleConvenio(
        ID_EMPRESA,
        'UOMA',
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
          fecha_total={'09/07/2024'}
          deuda={detalleConvenio.totalAPagar}
          saldo_a_favor={detalleConvenio.saldoAFavor}
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
                TOTAL: {formatter.currencyString(totalBoletas)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GrillaPeriodo
              boletas={boletas}
              selectedBoletas={selectedBoletas}
              setSelectedBoletas={setSelectedBoletas}
            />
          </AccordionDetails>
        </Accordion>
        {/*
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
                Convenios
              </Typography>
              <Typography variant="h6" color="primary">
                TOTAL: {formatter.currencyString(totalConvenios)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <GrillaConvenio convenios={convenios} />
          </AccordionDetails>
        </Accordion>
      */}
        <OpcionesDePago
          cuotas={cuotas}
          setCuotas={setCuotas}
          fechaIntencion={fechaIntencion}
          setFechaIntencion={setFechaIntencion}
          noUsar={noUsar}
          setNoUsar={setNoUsar}
          medioPago={medioPago}
          detalleConvenio={detalleConvenio}
        ></OpcionesDePago>
      </div>
    </div>
  );
};
