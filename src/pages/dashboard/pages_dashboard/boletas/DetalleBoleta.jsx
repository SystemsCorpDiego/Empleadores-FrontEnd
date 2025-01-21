import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import './Boletas.css';
import { Box } from '@mui/system';
import { axiosBoletas } from './BoletasApi';
import localStorageService from '@/components/localStorage/localStorageService';
import {
  boletaPdfDownload,
  detallePdfDownload,
} from '@/common/api/BoletaCommonApi';
import formatter from '@/common/formatter';
import { useParams } from 'react-router-dom';
import { calcularInteresBoleta } from '../generar_boletas/GenerarBoletasApi';
import { consultarFormasPago } from '@/common/api/FormaPagoApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const getDescripcion = (vector, codigo) => {
  if (vector && vector.find) {
    let reg = vector.find((reg) => reg.codigo == codigo);
    if (!reg) return codigo;
    return reg.descripcion;
  }
};

export const DetalleBoleta = () => {
  const [boletaDetalle, setBoletaDetalle] = useState([]);
  const [afiliadosRows, setAfiliadosRows] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [metodoPago, setMetodoPago] = useState('');
  const [intencionDePago, setIntencionDePago] = useState('');
  const [ddjj_id, setDDDJJ_id] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [respaldoBoleta, setRespaldoBoleta] = useState([]);
  const [ajustes, setAjustes] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const navigate = useNavigate();

  const ID_EMPRESA = localStorageService.getEmpresaId();
  //const formasPago = [
  //    { codigo: 'VENTANILLA', descripcion: 'Ventanilla' },
  //  { codigo: 'REDLINK', descripcion: 'Red Link' },
  //{ codigo: 'PMCUENTAS', descripcion: 'Pago Mis Cuentas' },
  //];

  useEffect(() => {
    const fetchFormaPago = async () => {
      const fp = await consultarFormasPago();
      setFormasPago(fp);
    };
    fetchFormaPago();
  }, []);

  const { numero_boleta } = useParams();

  console.log(numero_boleta);
  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosBoletas.getBoletaById(
          ID_EMPRESA,
          numero_boleta,
        );

        console.log(response);
        setBoletaDetalle(response);
        setAfiliadosRows(
          response.afiliados.map((afiliado, index) => ({
            ...afiliado,
            id: index + 1,
          })),
        );
        setMetodoPago(response.formaDePago);
        setIntencionDePago(response.intencionDePago);
        setDDDJJ_id(response.declaracion_jurada_id);
        setCodigo(response.codigo);
        setIsEditable(!response.fecha_de_pago && response.baja == null);
        setAjustes(response.ajustes);
        setRespaldoBoleta(JSON.parse(JSON.stringify(response)));
        console.log(boletaDetalle.periodo);
        console.log(boletaDetalle);
      } catch (error) {
        console.error('Error al obtener los datos de la boleta:', error);
      }
    };
    fetchData();
  }, []);

  const guardarBoletaValidar = async () => {
    //console.log(`guardarBoletaValidar - id: ${boletaDetalle.id}`);
    const val = await axiosBoletas.validarModificacion(
      ID_EMPRESA,
      boletaDetalle.id,
    );
    console.log('guardarBoletaValidar - val: ', val);

    if (val && val.hasOwnProperty('reemplazar')) {
      if (val.reemplazar == false) {
        guardarBoleta();
        //return true;
      } else {
        Swal.fire({
          title: 'Confirmación',
          text: 'Esta modificación reemplazará la actual Boleta de Pago por una "Nueva". Confirma la acción?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Reemplazar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            guardarBoleta();

            //return true;
          }
        });
      }
    }
    return false;
  };

  const guardarBoleta = async () => {
    //console.log('guardarBoleta - guardarBoleta: ', boletaDetalle);
    const rta = await axiosBoletas.modificarBoletaById(
      ID_EMPRESA,
      boletaDetalle,
    );
    console.log(rta);
    if (rta == true) {
      respaldoBoleta.intencionDePago = boletaDetalle.intencionDePago;
      respaldoBoleta.formaDePago = boletaDetalle.formaDePago;
      // console.log(
      //   'guardarBoleta - respaldoBoleta ACTUALIZADA: ',
      //   respaldoBoleta,
      // );
      setMetodoPago(boletaDetalle.formaDePago);
      console.log('estoy llegando al swal');
      Swal.fire({
        title: 'Modificado',
        text: 'Registro modificado con éxito. ¿Desea ver sus boletas?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#1A76D2',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ir a Mis Boletas',
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate('/dashboard/boletas');
        }
      });
    }
  };

  const handlesSetIntencionDePago = async (value) => {
    setIntencionDePago(value);

    const response = await calcularInteresBoleta(
      ID_EMPRESA,
      ddjj_id,
      codigo,
      value,
    );
    let objetoModificado = { ...boletaDetalle };

    for (let key in response) {
      //console.log(key);
      if (response.hasOwnProperty(key)) {
        objetoModificado[key] = response[key];
      }
    }
    setBoletaDetalle(objetoModificado);
  };

  const handleSetMetodoPago = async (value) => {
    //console.log('handleSetMetodoPago - value:', value);
    setMetodoPago(value);
    const nuevaBoleta = JSON.parse(JSON.stringify(boletaDetalle));
    nuevaBoleta.formaDePago = value;
    setBoletaDetalle(nuevaBoleta);
    //console.log('handleSetMetodoPago - nuevaBoleta:', nuevaBoleta);
  };

  const handleGuardar = () => {
    guardarBoletaValidar();
    //guardarBoleta();
    //console.log('handleGuardar - setModoEdicion() ..');
    setModoEdicion(!modoEdicion);
    //navigate(`/dashboard/boletas`);
  };

  const handleCancelar = () => {
    setBoletaDetalle(respaldoBoleta);
    setIntencionDePago(respaldoBoleta.intencionDePago);
    setMetodoPago(respaldoBoleta.formaDePago);
    setModoEdicion(!modoEdicion);
  };

  const existeDato = (value) => (value !== null && value !== '' ? value : '');

  //console.log('DetalleBoleta - metodoPago: ', metodoPago);
  //console.error();

  return (
    <div className="boletas_container">
      <h1>
        Boleta de Pago Nro. {boletaDetalle?.numero_boleta}
        <br></br>
        <br></br>
        <h3 style={{ color: '#1A76D2' }}>
          Concepto: {boletaDetalle?.descripcion}
        </h3>
        {boletaDetalle.baja != null && (
          <h3 style={{ color: '#1A76D2' }}>
            Fecha Baja: {formatter.date(boletaDetalle?.baja)}
          </h3>
        )}
      </h1>

      {boletaDetalle.baja == null && (
        <Button
          onClick={() => detallePdfDownload(ID_EMPRESA, boletaDetalle.id)}
        >
          Descargar Detalle
        </Button>
      )}

      {boletaDetalle.baja == null && (
        <Button onClick={() => boletaPdfDownload(ID_EMPRESA, boletaDetalle.id)}>
          Descargar Boleta
        </Button>
      )}

      {isEditable && !modoEdicion && (
        <Button
          variant="contained"
          onClick={() => setModoEdicion(!modoEdicion)}
          color="primary"
        >
          Editar
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="titulos">
            <TableRow>
              <TableCell className="cw">Periodo</TableCell>
              <TableCell className="cw">Tipo DDJJ</TableCell>

              <TableCell className="cw">Subtotal</TableCell>
              <TableCell className="cw">Intereses</TableCell>
              <TableCell className="cw">Importe Boleta</TableCell>
              {boletaDetalle.importe_recibido && (
                <TableCell className="cw">Importe Recibido</TableCell>
              )}
              {boletaDetalle.fecha_de_pago && (
                <TableCell className="cw">Fecha de Pago</TableCell>
              )}
              <TableCell className="cw">Vencimiento</TableCell>
              <TableCell className="cw">Intención de Pago</TableCell>
              <TableCell className="cw">Método de Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={boletaDetalle.descripcion}>
              <TableCell>
                {existeDato(boletaDetalle.periodo)
                  ? formatter.periodo(boletaDetalle.periodo)
                  : ''}
              </TableCell>
              <TableCell>
                {boletaDetalle.tipo_ddjj ? boletaDetalle.tipo_ddjj : 'Original'}
              </TableCell>

              <TableCell className="importes">
                {existeDato(
                  formatter.currency.format(boletaDetalle.total_acumulado),
                )}
              </TableCell>
              <TableCell className="importes">
                {existeDato(formatter.currency.format(boletaDetalle.interes))}
              </TableCell>
              <TableCell className="importes">
                {existeDato(
                  formatter.currency.format(
                    boletaDetalle.total_acumulado + boletaDetalle.interes,
                  ),
                )}
              </TableCell>
              {boletaDetalle.importe_recibido && (
                <TableCell className="importes">
                  {existeDato(
                    formatter.currency.format(boletaDetalle.importe_recibido),
                  )}
                </TableCell>
              )}
              <TableCell>
                {existeDato(formatter.date(boletaDetalle.vencimiento))}
              </TableCell>
              {boletaDetalle.fecha_de_pago && (
                <TableCell>
                  {existeDato(formatter.date(boletaDetalle.fecha_de_pago))}
                </TableCell>
              )}
              <TableCell>
                {isEditable && modoEdicion ? (
                  <TextField
                    type="date"
                    inputProps={{ min: hoy }}
                    value={existeDato(intencionDePago) && intencionDePago}
                    onChange={(event) =>
                      handlesSetIntencionDePago(event.target.value)
                    }
                  />
                ) : existeDato(boletaDetalle.intencionDePago) ? (
                  formatter.date(boletaDetalle.intencionDePago)
                ) : (
                  ''
                )}
              </TableCell>
              <TableCell>
                {isEditable && modoEdicion ? (
                  <Select
                    value={metodoPago}
                    onChange={(event) =>
                      handleSetMetodoPago(event.target.value)
                    }
                  >
                    {formasPago.map((reg) => (
                      <MenuItem value={reg.codigo} key={reg.codigo}>
                        {reg.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  getDescripcion(formasPago, boletaDetalle.formaDePago)
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          width: '100%',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1A76D2',
            color: 'white',
          },
        }}
      >
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={afiliadosRows}
            columns={[
              { field: 'cuil', headerName: 'CUIL', flex: 1 },
              { field: 'apellido', headerName: 'Apellido', flex: 1 },
              { field: 'nombre', headerName: 'Nombre', flex: 1 },
              {
                field: 'remunerativo',
                headerName: 'Remunerativo',
                align: 'right',
                flex: 1,
                valueFormatter: (params) =>
                  formatter.currency.format(params.value),
              },
              {
                field: 'capital',
                headerName: 'Capital',
                align: 'right',
                flex: 1,
                valueFormatter: (params) =>
                  formatter.currency.format(params.value),
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </div>

        {isEditable && modoEdicion && (
          <Box
            sx={{
              mt: 2,
              mr: 2,
              display: 'flex',
              flexDirection: 'row-reverse',
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleGuardar();
              }}
              color="primary"
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCancelar();
              }}
              color="primary"
            >
              Canclear
            </Button>
          </Box>
        )}
      </Box>
      <div className="space-between">
        <TableContainer className="w30">
          <Table sx={{ maxWidth: 200 }}>
            <TableBody>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell className="importes">
                  {formatter.currency.format(
                    existeDato(boletaDetalle.total_acumulado),
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Interes</TableCell>
                <TableCell className="importes">
                  {boletaDetalle.interes
                    ? formatter.currency.format(boletaDetalle.interes)
                    : formatter.currency.format(0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ajustes</TableCell>
                <TableCell className="importes">
                  {formatter.currency.format(
                    boletaDetalle.ajustes
                      ? boletaDetalle.ajustes.reduce(
                          (acumulador, ajuste) => acumulador + ajuste.monto,
                          0,
                        )
                      : 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Final</TableCell>
                <TableCell className="importes">
                  {existeDato(
                    formatter.currency.format(boletaDetalle.total_final),
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {ajustes &&
          ajustes.length > 0 &&
          ajustes.map((ajuste, index) => (
            <div key={index} className="w30">
              {index === 0 && (
                <h3 style={{ color: '#1A76D2' }}>Ajustes aplicados</h3>
              )}
              <p>{ajuste.descripcion}</p>
              <ul>
                <li key={index}>
                  {ajuste.descripcion}:{' '}
                  {formatter.currency.format(ajuste.monto)}
                </li>
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};
