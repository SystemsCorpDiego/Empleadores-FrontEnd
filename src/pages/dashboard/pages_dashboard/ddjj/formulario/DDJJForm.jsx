import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PropTypes from 'prop-types';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import { UserContext } from '@/context/userContext';
import formatter from '@/common/formatter';
import Swal from 'sweetalert2';
import swal from '@/components/swal/swal';
import { axiosDDJJ } from './DDJJApi';
import localStorageService from '@/components/localStorage/localStorageService';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import Switch from '@mui/material/Switch';
import { CircularProgress } from '@mui/material';
import { ThreeCircles } from 'react-loader-spinner';

import { DDJJArchivoImport } from '@/pages/dashboard/pages_dashboard/ddjj/formulario/DDJJArchivoImport';
import { DDJJPeriodoAnterior } from '@/pages/dashboard/pages_dashboard/ddjj/formulario/DDJJPeriodoAnterior';
import { DDJJCuilForm } from '@/pages/dashboard/pages_dashboard/ddjj/formulario/DDJJCuilForm';
import { useGridValidaciones } from './useGridValidaciones';
import { useGridCrud } from './useGridCrud';
import { DDJJMapper } from './DDJJMapper';
import './DDJJForm.css';

import {
  Stack,
  Typography,
  Tab,
  Tabs,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Box,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  useGridApiRef,
} from '@mui/x-data-grid';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//        MOCK: carga de 3000 registros.-
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//let rowsNew = [];
/*
const regNew = {
  id: 1,
  gErrores: false,

  regId: null,
  cuil: '23279737229',
  apellido: 'VÁZQUEZ',
  nombre: 'LOT',
  fechaIngreso: '2021-01-01',
  empresaDomicilioId: 41,
  camara: 'FAIM',
  categoria: 'B',
  remunerativo: 100580500,
  noRemunerativo: 100,
  uomaSocio: false,
  amtimaSocio: false,
  aportes: [
    {
      codigo: 'ART46',
      importe: 482.66,
    },
    {
      codigo: 'UOMACU',
      importe: 1005805,
    },
  ],
};
const regNew2 = { ...regNew };
regNew2.cuil = '20233725006';
regNew2.regId = 1;
rowsNew.push(regNew2);

for (let i = 2; i < 30; i++) {
  const regNewN = { ...regNew };

  regNewN.regId = i;

  regNewN.id = i;
  regNewN.gErrores = false;
  if (i % 2 == 0) {
    regNewN.gErrores = true;
  }

  regNewN.apellido =
    regNewN.apellido + ' ' + regNewN.regId + '-' + regNewN.gErrores;
  //console.log('regNewN.errores:', regNewN.errores);
  rowsNew.push(regNewN);
}

console.log('INIT - rowsNew:', rowsNew);
*/
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
function EditToolbar(props) {
  const {
    setRows,
    rows,
    setRowModesModel,
    showQuickFilter,
    themeWithLocale,
    filtrarGrilla,
    gridApiRef,
    setSortModel,
  } = props;

  const getNewReg = () => {
    let vecId = gridApiRef.current.getAllRowIds();
    console.log('getNewReg - vecId.length:', vecId.length);
    console.log('getNewReg - vecId:', vecId);

    console.log('getNewReg - getRowModels:', gridApiRef.current.getRowModels());

    let maxId = 0;

    if (vecId.length > 0) maxId = Math.max(...vecId, 0);
    console.log('getNewReg - maxId:', maxId);

    const newId = maxId + 1;
    const newReg = {
      id: newId,
      gErrores: false,

      regId: null,
      cuil: '',
      apellido: '',
      nombre: '',
      camara: '',
      fechaIngreso: '',
      empresaDomicilioId: '',
      categoria: '',
      remunerativo: null,
      noRemunerativo: null,
      uomaSocio: '',
      amtimaSocio: '',
    };
    return newReg;
  };

  const toolbarHandleClickAlta = () => {
    console.log('toolbarHandleClickAlta - rows:', rows);

    setSortModel([]);
    const newReg = getNewReg();
    console.log('toolbarHandleClickAlta - newReg:', newReg);
    gridApiRef.current.updateRows([newReg]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newReg.id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));

    gridApiRef.current.setPage(0);

    gridApiRef.current.setSortModel([
      {
        field: 'id',
        sort: 'desc',
      },
    ]);
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={toolbarHandleClickAlta}
      >
        Nuevo Registro
      </Button>
      <FormControlLabel
        control={<Switch color="primary" />}
        label="Filtrar líneas con errores"
        labelPlacement="start"
        onChange={filtrarGrilla}
      ></FormControlLabel>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
}
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export const DDJJForm = ({ idDDJJ, mostrarConsultaMissDDJJ, initFormDDJJ }) => {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [ddjjCabe, setDdjjCabe] = useState({
    id: idDDJJ || null,
    secuencia: null,
    periodo: null,
    estado: null,
    empresaId: ID_EMPRESA,
  });
  console.log('** DDJJForm - idDDJJ: ', idDDJJ);
  const gridApiRef = useGridApiRef();
  const [rows, setRows] = useState([]); //Con esto lleno la grilla. NO Representa lo que tiene la grilla en todo momento!!!
  const [ddjjModi, setDdjjModi] = useState(false); //Bandera para saber si se actualizo algun dato
  //rowsNew => es el vector que viene de Archivo o de Backend antes de cargar la grilla.-
  const [rowsValidaciones, setRowsValidaciones] = useState([]); //Usado para "Pintar" errores en la grilla.-
  useGridValidaciones.getRowsValidaciones = rowsValidaciones;
  useGridValidaciones.setRowsValidaciones = setRowsValidaciones;
  const [rowModesModel, setRowModesModel] = useState({});
  useGridCrud.getRowModesModel = rowModesModel;
  useGridCrud.setRowModesModel = setRowModesModel;

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);

  const {
    paginationModel,
    setPaginationModel,
    pageSizeOptions,
    themeWithLocale,
  } = useContext(UserContext);

  const [deshabilitarGuardar, setDeshabilitarGuardar] = useState(true);

  const [habiModif, setHabiModif] = useState(false); //EX actualizacionHabilitada - SI estdo "PE" o ddjjCabe.id=null => puedo modificar.-
  const [tituloSec, setTituloSec] = useState('');

  const [formCuilReg, setFormCuilReg] = useState({
    cuil: null,
    apellido: null,
    nombre: null,
  });
  const [formCuilShow, setFormCuilShow] = useState(false);
  const [camaras, setCamaras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plantas, setPlantas] = useState([]);

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [someRowInEditMode, setSomeRowInEditMode] = useState(false);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const [loading, setLoading] = useState(false);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Box>{children}</Box>
          </Box>
        )}
      </Box>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const handleChangeE = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // Eventos
  const limpiarApeNombre = (texto) => {
    const patron = /[A-Za-z ]/;
    let textoLimpio = '';
    for (let i = 0; i <= texto.length - 1; i++) {
      let letra = texto[i];
      if (patron.test(letra)) {
        textoLimpio = textoLimpio + letra;
        //console.log(testo);
        //console.log('patron.test(testo): FALSE - letra:', letra);
        //return false;
      }
    }
    return textoLimpio;
  };

  const validarPeriodo = async (date) => {
    console.log('validarPeriodo - date:', date);
    if (ddjjCabe && ddjjCabe.id) {
      return false;
    }
    if (!date || !date.isValid()) return false;

    const periodo = date.startOf('month').format('YYYY-MM-DD');
    const info = await axiosDDJJ.infoPeriodoConsulta(ID_EMPRESA, periodo);

    if (info) {
      let msg =
        '<div>EL Periodo <b>' +
        formatter.periodoString(date) +
        '</b> ya cuenta con una DDJJ en estado <b>' +
        (info.estado === 'PE' ? 'Pendiente' : 'Presentada') +
        '</b> con fecha <b>' +
        (info.estado === 'PE'
          ? formatter.dateString(info.fechaCreacion)
          : formatter.dateString(info.fechaPresentacion)) +
        '</b>.';

      if (info.estado === 'PE') {
        msg +=
          '<br><br>Debe completarla y Presentarla para poder dar de alta una nueva DDJJ.</div>';
        swal.showWarning(msg, true);
        setDdjjCabe({ ...ddjjCabe, periodo: null });
        mostrarConsultaMissDDJJ();
        return false;
      } else {
        msg += '.<br><br> Desea ingresar una nueva DDJJ ?<br><br>';

        const confirm = {
          titulo: 'Alta de DDJJ',
          texto: msg,
          esHtml: true,
          textoBtnOK: 'Continuar',
        };
        Swal.fire(swal.getSettingConfirm(confirm)).then(async (result) => {
          if (result.isDismissed) {
            setDdjjCabe({ ...ddjjCabe, periodo: null });
            return false;
          }
        });
      }
      return true;
    }
  };

  const handleFormCuilOpen = (row) => () => {
    //EX handleDataModal
    console.log('handleFormCuilOpen - INIT - row:', row);

    setFormCuilReg({
      cuil: row.cuil,
      apellido: row.apellido,
      nombre: row.nombre,
    });
    let auxx = true;
    if (formCuilShow) {
      auxx = false;
    } else {
      auxx = true;
    }

    console.log('handleFormCuilOpen - formCuilShow:', formCuilShow);
    console.log('-------------------------------------');
    console.log('handleFormCuilOpen - auxx:', auxx);
    setFormCuilShow(auxx);
    console.log('-------------------------------------');
    console.log('handleFormCuilOpen - FIN ');
  };

  const obtenerAfiliados = async (id, cuilNew) => {
    console.log('obtenerAfiliados - cuilNew:', cuilNew);
    console.log('obtenerAfiliados - id:', id);

    let afiliados = null;

    const rta = await getAfiliadoEnNomina(cuilNew);
    console.log('obtenerAfiliados - rta:', rta);
    if (rta.error != 'OK') {
      swal.showWarning(rta.error);
      setAfiliadoGrilla(id, '', '', '');
      return false;
    }

    console.log('obtenerAfiliados - (2)');
    const afiliadoDB = rta.afiliados?.find(
      (afiliado) => afiliado.cuil === cuilNew,
    );

    console.log('obtenerAfiliados - (3)');
    if (!afiliadoDB) {
      swal.showWarning(
        'CUIL inexistente en la nómina de Afiliados. El mismo sera dado de alta cuando registre la DDJJ.',
      );
      setAfiliadoGrilla(id, cuilNew, '', '');
    } else {
      setAfiliadoGrilla(id, cuilNew, afiliadoDB.apellido, afiliadoDB.nombre);
      //setAfiliado(afiliadoDB); //TODO: En codigo Original=> viene del padre !!!
    }
    console.log('obtenerAfiliados - FIN');
  };

  const getAfiliadoEnNomina = async (cuil) => {
    console.log('getAfiliadoEnNomina - cuil:', cuil);
    const rta = {};
    if (cuil === '') {
      rta.error = 'Debe ingresar un CUIL y presionar la lupa';
      console.log('getAfiliadoEnNomina - 1 - rta:', rta);
      return rta;
    }

    if (cuil.length != 11) {
      rta.error =
        'El CUIL ingresado (' +
        cuil +
        ') es incorrecto, debe tener 11 dígitos.';
      console.log('getAfiliadoEnNomina - 2 - rta:', rta);
      return rta;
    }

    const validoCuil = await axiosDDJJ.validarCuil(cuil);
    if (!validoCuil || !validoCuil.resultado) {
      rta.error = 'El CUIL ingresado (' + cuil + ') no es válido.';
      console.log('getAfiliadoEnNomina - 3 - rta:', rta);
      console.log('getAfiliadoEnNomina - 3 - validoCuil:', validoCuil);

      return rta;
    }

    //const afiliados = await axiosDDJJ.getAfiliado(cuil);
    rta.error = 'OK';
    rta.afiliados = await axiosDDJJ.getAfiliado(cuil);
    console.log('getAfiliadoEnNomina - rta:', rta);

    return rta;
  };

  const setAfiliadoGrilla = (id, cuil, apellido, nombre) => {
    console.log('setAfiliadoGrilla - id:', id);
    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'cuil',
      value: cuil,
    });

    // Apellido
    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'apellido',
      value: apellido,
    });

    // Nombre
    gridApiRef.current.setEditCellValue({
      id: id,
      field: 'nombre',
      value: nombre,
    });
    const textFieldNombre = document.getElementById('nombre' + id);
  };

  const filtrarGrilla = () => {
    console.log(
      'filtrarGrilla - gridApiRef.current.getRowModels(): ',
      gridApiRef.current.getRowModels(),
    );
    console.log('filtrarGrilla - filterModel:', filterModel);

    const newFilterModel = { ...filterModel };
    if (filterModel.items.length == 0) {
      console.log('filtrarGrilla - filterModel.items.length == 0');
      newFilterModel.items = [
        {
          field: 'gErrores',
          operator: 'is',
          value: 'true',
        },
        /*{field: 'apellido',operator: 'contains',value: 'P',},*/
      ];
    } else {
      console.log('filtrarGrilla - filterModel.items.length != 0');
      newFilterModel.items = [];
    }
    setFilterModel(newFilterModel);
    console.log('2 filtrarGrilla - newFilterModel:', newFilterModel);
    console.log('filtrarGrilla - FINAL');
  };

  const getCellClassName = (params) => {
    let cellClassName = '';

    rowsValidaciones?.errores?.forEach((error) => {
      if (
        params.row.cuil?.toString() === error.cuil &&
        params.field === error.codigo
      ) {
        cellClassName = 'hot';
      }
    });

    // Action no implementar estilos hot o cold
    if (params.field === 'actions') {
      cellClassName = '';
    }

    return cellClassName;
  };

  const getCategoriasCamara = (codigoCamara) => {
    const filtroCategorias = categorias.filter(
      (categoria) => categoria.camara === codigoCamara,
    );
    const soloCategorias = filtroCategorias.map((item) => item.categoria);
    return soloCategorias;
  };

  const handlerGrillaActualizarImportArchivo = async (vecDatos) => {
    setExpanded(true);
    setLoading(true);
    console.log(
      '** handlerGrillaActualizarImportArchivo - vecDatos: ',
      vecDatos,
    );
    //recibe vecDatos de Archivo para actualizar Grilla.-
    console.log('** DDJJForm.ImportArchivo - vecDatos: ', vecDatos);
    console.log('** DDJJForm.ImportArchivo - ddjjCabe: ', ddjjCabe);
    const newRowsValidaciones = await useGridValidaciones.validarDDJJ(
      ddjjCabe,
      vecDatos,
    );
    console.log(
      '** DDJJForm.ImportArchivo - newRowsValidaciones: ',
      newRowsValidaciones,
    );

    const rowsNew = await useGridValidaciones.actualizarFiltroErrores(
      vecDatos,
      newRowsValidaciones,
    );
    setLoading(false);
    console.log(
      '** handlerGrillaActualizarImportArchivo - validarDDJJ() - rowsNew: ',
      rowsNew,
    );
    setRows(rowsNew);

    if (ddjjCabe.periodo == null)
      setDdjjCabe({ ...ddjjCabe, periodo: formatter.getPeriodoActual() });

    setDdjjModi(true);
    setExpanded(true);
  };

  const handlerGrillaActualizarPeriodoAnterior = (vecDatos) => {
    //No valido, solo cargo. Solo se copian DDJJ Presentadas (sin errores)
    console.log(
      'handlerGrillaActualizarPeriodoAnterior() - vecDatos:',
      vecDatos,
    );
    limpiarEstadoDetalleForm();
    setRows(vecDatos);
    if (ddjjCabe.periodo == null)
      setDdjjCabe({ ...ddjjCabe, periodo: formatter.getPeriodoActual() });
    setDdjjModi(true);
    setExpanded(true);
  };

  const habiModifRefresh = () => {
    console.log('habiModifRefresh - INIT - idDDJJ:', idDDJJ);
    if (!idDDJJ) {
      console.log('habiModifRefresh - !idDDJJ');
      //Si no edito DDJJ, se habilita todo
      setHabiModif(true);
      return true;
    } else {
      console.log('habiModifRefresh - ddjjCabe:', ddjjCabe);
      //Si la DDJJ esta pendiente, se habilita todo.-
      if (ddjjCabe && ddjjCabe.estado && ddjjCabe.estado == 'PE') {
        console.log('habiModifRefresh - ddjjCabe.estado == PE');
        setHabiModif(true);
        return true;
      }
    }
    console.log('habiModifRefresh - false!!!');
    setHabiModif(false);
    return false;
  };

  const getTituloSec = (ddjjCabeNew) => {
    if (!ddjjCabeNew || ddjjCabeNew == null) {
      ddjjCabeNew = ddjjCabe;
    }

    if (ddjjCabeNew) {
      if (ddjjCabeNew.estado && ddjjCabeNew.estado == 'PE') {
        return 'Pendiente';
      }
      if (
        ddjjCabeNew.hasOwnProperty('secuencia') &&
        ddjjCabeNew.secuencia != null &&
        ddjjCabeNew.secuencia != 0
      ) {
        return 'Rectificativa Nro: ' + ddjjCabeNew.secuencia;
      }
      if (
        ddjjCabeNew.hasOwnProperty('secuencia') &&
        ddjjCabeNew.secuencia === 0
      ) {
        console.log('getTituloSec - FIN - ddjjCabeNew - 3');
        return 'Original';
      }
    }
    return ' Nueva';
  };

  const getDDJJ = async (idDDJJ) => {
    const ddjjCabeNew = { ...ddjjCabe, id: idDDJJ };
    console.log('DDJJForm - getDDJJ() - ddjjCabeNew: ', ddjjCabeNew);
    const ddjjResponse = await axiosDDJJ.getDDJJ(
      ddjjCabeNew.empresaId,
      ddjjCabeNew.id,
    );
    console.log(
      'DDJJForm - getDDJJ() - axiosDDJJ.getDDJJ - ddjjResponse: ',
      ddjjResponse,
    );

    ddjjCabeNew.periodo = formatter.dateObject(ddjjResponse.periodo);
    ddjjCabeNew.secuencia = ddjjResponse.secuencia;
    ddjjCabeNew.estado = ddjjResponse.estado;
    //console.log('DDJJForm - getDDJJ() - ddjjCabeNew: ', ddjjCabeNew);

    const newRowsValidaciones = await useGridValidaciones.validarDDJJ(
      ddjjCabeNew,
      ddjjResponse.afiliados,
    );

    const rowsNew = await useGridValidaciones.actualizarFiltroErrores(
      ddjjResponse.afiliados,
      newRowsValidaciones,
    );

    console.log(rowsNew);
    console.log('--------------');

    setDdjjCabe(ddjjCabeNew);

    console.log('DDJJForm - getDDJJ() - rowsNew: ', rowsNew);
    setRows(rowsNew);
    setExpanded(true);
  };

  const getMsgValidaciones = () => {
    if (useGridValidaciones.tieneErrores()) {
      const mensajesUnicos = new Set();
      console.log(
        'getMsgValidaciones - rowsValidaciones:',
        rowsValidaciones.errores,
      );
      console.log(
        'getMsgValidaciones - useGridValidaciones.getRowsValidaciones:',
        useGridValidaciones.getRowsValidaciones,
      );
      useGridValidaciones.getRowsValidaciones.errores.forEach((error) => {
        if (!mensajesUnicos.has(error.descripcion)) {
          mensajesUnicos.add(error.descripcion);
        }
      });

      const mensajesFormateados = Array.from(mensajesUnicos)
        .map((mensaje, index) => {
          return `<p>${index + 1} - ${mensaje} (${getColsMsgValidacion(mensaje)})</p>`;
        })
        .join('');

      console.log(
        'getMsgValidaciones - mensajesFormateados:',
        mensajesFormateados,
      );
      return mensajesFormateados;
    }
  };

  const getColsMsgValidacion = (msgError) => {
    const colUnicas = new Set();
    useGridValidaciones.getRowsValidaciones.errores.forEach((error) => {
      if (msgError == error.descripcion) {
        if (!colUnicas.has(error.codigo)) {
          colUnicas.add(error.codigo);
        }
      }
    });

    console.log('getColsMsgValidacion - colUnicas:', colUnicas);

    if (colUnicas.size > 0) {
      const mensajesFormateados = Array.from(colUnicas)
        .map((codigo, index) => {
          if (codigo == 'empresaDomicilioId') return 'Planta';
          if (codigo == 'periodo') return 'Período';
          const reg = columns.find((regloop) => {
            return regloop.field === codigo;
          });
          if (reg) return reg.headerName;
          return '';
        })
        .join(', ');
      return mensajesFormateados;
    }
    return '';
  };

  const guardarDDJJConfirm = async () => {
    //Armo mensaje de vcalidacion si hay Errores.-
    if (
      gridApiRef.current.hasOwnProperty('getRowModels') &&
      gridApiRef.current.getRowModels().size == 0
    ) {
      return false;
    }

    console.log(
      'xx guardarDeclaracionJurada - rowsValidaciones:',
      rowsValidaciones,
    );
    console.log(
      'xx guardarDeclaracionJurada - useGridValidaciones.getRowsValidaciones:',
      useGridValidaciones.getRowsValidaciones,
    );
    if (useGridValidaciones.tieneErrores()) {
      Swal.fire({
        icon: 'error',
        title: 'Validación de Declaración Jurada',
        html: `${getMsgValidaciones()}<br>
                      <label for="guardarErrores">Puede guardar la DDJJ y corregir los errores en otro momento antes de presentar</label>`,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setDeshabilitarGuardar(true);
          setShowLoading(true);
          await guardarDDJJ();
          setDeshabilitarGuardar(false);
          setShowLoading(false);
        }
      });
    } else {
      setDeshabilitarGuardar(true);
      setShowLoading(true);
      await guardarDDJJ();
      setDeshabilitarGuardar(false);
      setShowLoading(false);
    }
  };

  const getVecFromGrilla = () => {
    //Tomo los reg de la Grilla y los valido.-
    const mapDatos = gridApiRef.current.getRowModels();
    console.log('getVecFromGrilla - mapDatos:', mapDatos);
    console.log('getVecFromGrilla - mapDatos.size:', mapDatos.size);
    const vecDatos = [];
    mapDatos.forEach((value, name) => vecDatos.push({ ...value }));

    console.log('getVecFromGrilla - vecDatos:', vecDatos);
    return vecDatos;
  };

  const validarDDJJ = async () => {
    console.log('DDJJForm.validarDDJJ - INIT');
    //Tomo los reg de la Grilla y los valido.-
    const vecDatos = getVecFromGrilla();

    if (vecDatos && vecDatos.length > 0 && ddjjCabe.periodo) {
      console.log('DDJJForm.validarDDJJ - VALIDAAAA');
      const newRowsValidaciones = await useGridValidaciones.validarDDJJ(
        ddjjCabe,
        vecDatos,
      );

      const rowsNew = await useGridValidaciones.actualizarFiltroErrores(
        vecDatos,
        newRowsValidaciones,
      );
      setRows(rowsNew);
      setDdjjModi(true);
    }
  };

  const guardarDDJJ = async () => {
    console.log('guardarDDJJ - INIT');

    //Tomo los reg de la Grilla.-
    const vecDatos = getVecFromGrilla();

    //Casteo a Dto de backend.-
    const DDJJ = DDJJMapper.rowsToDDJJValDto(ddjjCabe, vecDatos);
    console.log('guardarDDJJ - DDJJ:', DDJJ);

    if (ddjjCabe.id) {
      console.log(
        'guardarDeclaracionJurada - axiosDDJJ.actualizar(ID_EMPRESA, DDJJ); ',
      );
      const bOK = await axiosDDJJ.actualizar(ID_EMPRESA, DDJJ);
      if (bOK) {
        setDdjjModi(false);
        return ddjjCabe.id;
      }
      return false;
    } else {
      console.log(
        'guardarDeclaracionJurada - axiosDDJJ.crear(ID_EMPRESA, DDJJ); ',
      );
      const data = await axiosDDJJ.crear(ID_EMPRESA, DDJJ);
      console.log('guardarDeclaracionJurada - axiosDDJJ.crear - data:', data);
      if (data) {
        setDdjjCabe({
          ...ddjjCabe,
          id: data.id,
          secuencia: null,
          estado: 'PE',
        });

        altaDDJJUpdateGrillaAfiliadosId(data);
        setTituloSec(getTituloSec(data));
        setDdjjModi(false);
        return data.id;
      }
    }
    return false;
  };

  const altaDDJJUpdateGrillaAfiliadosId = (ddjjNew) => {
    console.log('----------------------------------------');
    console.log('altaDDJJUpdateGrillaAfiliadosId - INIT');
    //recorrer Map de Grilla
    if (
      ddjjNew.empleados &&
      ddjjNew.empleados.length &&
      ddjjNew.empleados.length > 0
    ) {
      const vecEmpleados = ddjjNew.empleados;
      const mapDatos = gridApiRef.current.getRowModels();
      console.log('mapDatos:', mapDatos);
      console.log('vecEmpleados:', vecEmpleados);

      for (var [key, value] of mapDatos) {
        //alert(key + ' = ' + value);
        vecEmpleados.forEach((element) => {
          if (element.cuil == value.cuil) {
            value.regId = element.id;
            gridApiRef.current.updateRows([value]);
          }
        });
      }

      console.log(
        'gridApiRef.current.getRowModels():',
        gridApiRef.current.getRowModels(),
      );
    }

    //buscar CUIL en "vecDatosNew"
    //pegarle el vecDatosNew.afiliados.id en Grilla.idReg
    //actualizar registro en grilla
    //gridApiRef.current.updateRows([{ id: row.id }]);
    console.log('----------------------------------------');
  };

  const presentarDDJJ = async () => {
    //const seguir = await guardarDDJJConfirm();
    console.log('presentarDDJJ - INIT');
    console.log(
      'presentarDDJJ - useGridValidaciones.getRowsValidaciones:',
      useGridValidaciones.getRowsValidaciones,
    );

    if (!useGridValidaciones.tieneErrores()) {
      const confirm = {
        titulo: 'Presentación de DDJJ',
        texto:
          'Confirma la Presentación de la Declaración Jurada para el Período <b>' +
          formatter.periodo(ddjjCabe.periodo) +
          '</b>?',
        esHtml: true,
        textoBtnOK: 'Si, Presentar !',
      };
      Swal.fire(swal.getSettingConfirm(confirm)).then(async (result) => {
        console.log('presentarDDJJ - result:', result);
        if (result.isConfirmed) {
          if (!ddjjCabe.id || ddjjModi) {
            const idNew = await guardarDDJJ(); //viene false o el id
            if (idNew) {
              ddjjCabe.id = idNew;
            } else {
              result.isConfirmed = false;
            }
          }

          if (result.isConfirmed) {
            const data = await axiosDDJJ.presentar(ID_EMPRESA, ddjjCabe.id);
            if (data) {
              const ddjjCabeNew = {
                ...ddjjCabe,
                estado: data.estado,
                secuencia: data.secuencia,
              };
              setDdjjCabe(ddjjCabeNew);
              setTituloSec(getTituloSec(data));
              mostrarConsultaMissDDJJ();
            }
          } else {
            console.log(
              'presentarDDJJ - el guardarDDJJ() no andubo - result.isConfirmed: FALSE ',
            );
          }
        }
      });
    } else {
      console.log();
      Swal.fire({
        icon: 'error',
        title: 'Validación de Declaración Jurada',
        html: `La DDJJ no se pudo presentar.<br>Existen campos inválidos:<br><br> ${getMsgValidaciones()}<br>Corrija la información antes de Presentar la DDJJ `,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      });
    }
  };

  const limpiarEstadoForm = () => {
    //navigate('/dashboard/ddjj/alta');
    initFormDDJJ();

    //if (1 == 2) {
    setDdjjModi(false); //Bandera para saber si se actualizo algun dato

    console.log('limpiarEstadoForm - idDDJJ:', idDDJJ);

    idDDJJ = null; //limpio var de consulta grilla Mis DDJJ
    console.log('limpiarEstadoForm - idDDJJ:', idDDJJ);
    const ddjjCabeNew = {
      ...ddjjCabe,
      id: null,
      secuencia: null,
      periodo: null,
      estado: null,
    };
    setDdjjCabe(ddjjCabeNew);
    console.log('*5* - ddjjCabeNew: ', ddjjCabeNew);
    console.log('*5* - getTituloSec(ddjjCabeNew): ', getTituloSec(ddjjCabeNew));
    setTituloSec(getTituloSec(ddjjCabeNew));

    limpiarEstadoDetalleForm();
    habiModifRefresh();
    //}
  };

  const limpiarEstadoDetalleForm = () => {
    setRows([]); //Con esto lleno la grilla
    setRowsValidaciones([]); //Usado para "Pintar" errores en la grilla.-
  };

  const desHabilitarGrabar = () => {
    if (someRowInEditMode) return true;
    if (!habiModif) return true;
    if (
      gridApiRef.current.hasOwnProperty('getRowModels') &&
      gridApiRef.current.getRowModels().size == 0
    )
      return true;

    return false;
  };
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //            Hooks y Load de Datos
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  useEffect(() => {
    // Comprueba si hay alguna fila en modo edición
    const isSomeRowInEditMode = Object.values(rowModesModel).some(
      (row) => row.mode === GridRowModes.Edit,
    );
    // Actualiza el estado con el valor de booleano
    setSomeRowInEditMode(isSomeRowInEditMode);
  }, [rowModesModel]);

  useEffect(() => {
    const ObtenerCamaras = async () => {
      const data = await axiosDDJJ.getCamaras();
      setCamaras(data.map((item, index) => ({ id: index + 1, ...item })));
    };
    const ObtenerCategorias = async () => {
      const data = await axiosDDJJ.getCategorias();
      setCategorias(data.map((item, index) => ({ id: index + 1, ...item })));
    };
    const ObtenerPlantaEmpresas = async () => {
      if (!ID_EMPRESA) {
        swal.showError('El sistema no tiene seteado un Id de Empresa.');
        return false;
      }

      const data = await axiosDDJJ.getPlantas(ID_EMPRESA);
      setPlantas(data.map((item) => ({ id: item, ...item })));
    };

    ObtenerCamaras();
    ObtenerCategorias();
    ObtenerPlantaEmpresas();

    console.log('** idDDJJ:', idDDJJ);
    //console.log('** rowsNew:', rowsNew);
    if (idDDJJ) {
      getDDJJ(idDDJJ);
    } else {
      limpiarEstadoForm();
      console.log('** NO HIZO getDDJJ() !!!');
      //const rowsNew2 = rowsNewValidar(rowsNew);
      //setRows(rowsNew2);
    }
    console.log('** ddjjCabe:', ddjjCabe);
  }, []);

  useEffect(() => {
    setTituloSec(getTituloSec());
    habiModifRefresh();
    console.log('useEffect - ddjjCabe:', ddjjCabe);
    if (ddjjCabe.estado != 'PE' && ddjjCabe.estado != null) {
      console.log('useEffect - OK - setHabiModif(false); .....');
      setHabiModif(false);
    }
    validarDDJJ();
  }, [ddjjCabe]);

  useEffect(() => {
    setDeshabilitarGuardar(desHabilitarGrabar());
  }, [someRowInEditMode, habiModif, rows]);
  /*
   
  useEffect(() => {
    console.log('** 2) useEffect[rows] - validarDDJJ() - rowsNew: ', rowsNew);
    validarDDJJ();
  }, [rows]);
*/
  //TEST
  useEffect(() => {
    //MOCK:...
    console.log('** formCuilShow: ', formCuilShow);
  }, [formCuilShow]);

  useEffect(() => {
    console.log('*useEffect - someRowInEditMode:', someRowInEditMode);
    console.log('*useEffect - !habiModif:', !habiModif);
    console.log(
      'gridApiRef.current.getRowModels():',
      gridApiRef.current.getRowModels(),
    );
  }, [someRowInEditMode]);
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  const columns = [
    {
      field: 'id',
      type: 'number',
      width: 80,
      align: 'center',
      headerName: 'Fila',
      headerAlign: 'center',
      headerClassName: 'header--cell',
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      align: 'center',
      headerName: 'Acciones',
      headerAlign: 'center',
      headerClassName: 'header--cell',
      getActions: ({ row }) => {
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Tooltip
              key={Math.round(Math.random() * 100)}
              title="Guardar modificaciones en la grilla"
            >
              <GridActionsCellItem
                icon={<SaveIcon />}
                label=""
                sx={{
                  color: 'primary.main',
                }}
                onClick={() => {
                  console.log(
                    'useGridCrud.handleSaveClick(row.id) - row:',
                    row,
                  );
                  useGridCrud.handleSaveClick(row.id);
                }}
                disabled={!habiModif}
              />
            </Tooltip>,
            <Tooltip
              key={Math.round(Math.random() * 100)}
              title="Cancelar modificaciones realizadas"
            >
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancelar Edición"
                className="textPrimary"
                onClick={() => {
                  useGridCrud.handleCancelClick(gridApiRef, row);
                }}
                color="inherit"
              />
            </Tooltip>,
          ];
        }

        return [
          <Tooltip
            key={Math.round(Math.random() * 100)}
            title="Editar Resgistro"
          >
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => {
                useGridCrud.handleEditClick(row.id);
              }}
              color="inherit"
              disabled={!habiModif}
            />
          </Tooltip>,
          <Tooltip
            key={Math.round(Math.random() * 100)}
            title="Eliminar Resgistro"
          >
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                useGridCrud.handleDeleteClick(gridApiRef, row);
              }}
              color="inherit"
              disabled={!habiModif}
            />
          </Tooltip>,
        ];
      },
    },
    {
      field: 'cuil',
      type: 'string',
      width: 160,
      align: 'left',
      editable: true,
      headerName: 'CUIL',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      renderEditCell: (params) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id={params.row.id ? 'cuil' + params.row.id.toString() : ''}
              fullWidth
              value={params.value || ''}
              onChange={(event) => {
                const newValue = event.target.value;

                params.api.setEditCellValue({
                  id: params.id,
                  field: 'cuil',
                  value: newValue,
                });
              }}
              onBlur={(event) => {
                obtenerAfiliados(params.id, params.value);
              }}
              onFocus={(event) => {
                const cuilActual = params.api.getCellValue(params.id, 'cuil');
                console.log('onFocus - cuilActual:', cuilActual);
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            <Tooltip
              key={Math.round(Math.random() * 100)}
              title="Registrar cambio de Nombre"
            >
              <CreateIcon
                sx={{
                  fontSize: '1.8rem',
                  color: '#1A76D2',
                  cursor: 'pointer',
                }}
                onClick={handleFormCuilOpen(params.row)}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: 'apellido',
      type: 'string',
      width: 170,
      align: 'left',
      editable: true,
      headerName: 'Apellido',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      valueParser: (value, row, column, apiRef) => {
        return value?.toUpperCase();
      },
      renderEditCell: (params) => {
        return (
          <TextField
            id={params.row.id ? 'apellido' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  backgroundColor:
                    params.row?.cuil === '' ? 'white' : 'transparent',
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            onChange={(event) => {
              //console.log('onChange - event: ', event);
              let newValue = event.target.value;
              newValue = limpiarApeNombre(newValue);

              params.api.setEditCellValue({
                id: params.id,
                field: 'apellido',
                value: newValue,
              });
              event.target.value = newValue;
              return false;
            }}
            onBlur={async (event) => {
              const newValue = event.target.value;
              const cuilActual = params.api.getCellValue(params.id, 'cuil');
              console.log('onBlur - cuilActual:', cuilActual);
              const rtaValidacion = await getAfiliadoEnNomina(cuilActual);
              console.log('onBlur - strValidacion:', rtaValidacion);
              if (rtaValidacion.error == 'OK') {
                if (rtaValidacion.afiliados.length > 0) {
                  console.log(
                    'onBlur - rtaValidacion.afiliados[0].apellido:',
                    rtaValidacion.afiliados[0].apellido,
                  );
                  if (rtaValidacion.afiliados[0].apellido != newValue) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: 'apellido',
                      value: rtaValidacion.afiliados[0].apellido,
                    });
                    swal.showWarning(
                      'Para editar los datos del CUIL, debe utilizar el icono de Edición de la columna CUIL ',
                    );
                  }
                }
              }
            }}
          />
        );
      },
    },
    {
      field: 'nombre',
      type: 'string',
      width: 170,
      align: 'left',
      editable: true,
      headerName: 'Nombre',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      valueParser: (value, row, column, apiRef) => {
        return value?.toUpperCase();
      },
      renderEditCell: (params) => {
        return (
          <TextField
            id={params.row.id ? 'nombre' + params.row.id.toString() : ''}
            fullWidth
            value={params.value || ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  backgroundColor:
                    params.row?.cuil === '' ? 'white' : 'transparent',
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            onChange={(event) => {
              let newValue = event.target.value;
              newValue = limpiarApeNombre(newValue);
              params.api.setEditCellValue({
                id: params.id,
                field: 'nombre',
                value: newValue,
              });
            }}
            onBlur={async (event) => {
              const newValue = event.target.value;
              const cuilActual = params.api.getCellValue(params.id, 'cuil');
              console.log('onBlur - cuilActual:', cuilActual);
              const rtaValidacion = await getAfiliadoEnNomina(cuilActual);
              console.log('onBlur - strValidacion:', rtaValidacion);
              if (rtaValidacion.error == 'OK') {
                if (rtaValidacion.afiliados.length > 0) {
                  console.log(
                    'onBlur - rtaValidacion.afiliados[0].nombre:',
                    rtaValidacion.afiliados[0].nombre,
                  );
                  if (rtaValidacion.afiliados[0].nombre != newValue) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: 'nombre',
                      value: rtaValidacion.afiliados[0].nombre,
                    });
                    swal.showWarning(
                      'Para editar los datos del CUIL, debe utilizar el icono de Edición de la columna CUIL ',
                    );
                  }
                }
              }
            }}
          />
        );
      },
    },
    {
      field: 'camara',
      type: 'singleSelect',
      width: 80,
      align: 'left',
      editable: true,
      headerName: 'Cámara',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => value || '',
      valueOptions: camaras.map(({ codigo, descripcion }) => {
        return { value: codigo, label: descripcion };
      }),
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value !== null ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'categoria',
                value: '',
              });
              params.api.setEditCellValue({
                id: params.id,
                field: 'camara',
                value: event.target.value,
              });
            }}
          >
            {camaras.map((camara) => {
              return (
                <MenuItem
                  key={camara.codigo}
                  value={camara.codigo}
                  onClick={() => {
                    const vec = getCategoriasCamara(camara.codigo);
                    params.api.setEditCellValue({
                      id: params.id,
                      field: 'categoria',
                      value: vec[0],
                    });
                  }}
                >
                  {camara.descripcion}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'categoria',
      type: 'singleSelect',
      width: 80,
      align: 'left',
      editable: true,
      headerName: 'Categoría',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => value || '',
      renderEditCell: (params) => {
        console.log(params.row.camara);
        const categoriasCamara = getCategoriasCamara(params.row.camara);
        return (
          <Select
            fullWidth
            value={categoriasCamara.length > 0 ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'categoria',
                value: event.target.value,
              });
            }}
          >
            {categoriasCamara.map((categoria) => {
              return (
                <MenuItem key={categoria} value={categoria}>
                  {categoria}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'fechaIngreso',
      type: 'date',
      width: 100,
      align: 'left',
      editable: true,
      headerName: 'Ingreso',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      valueGetter: ({ value }) => {
        return formatter.dateObject(value);
      },
      valueFormatter: ({ value }) => {
        return formatter.dateString(value);
      },
    },
    {
      field: 'empresaDomicilioId',
      type: 'singleSelect',
      width: 200,
      align: 'left',
      editable: true,
      headerAlign: 'left',
      headerClassName: 'header--cell',
      headerTooltip: 'Selecciona la planta de la empresa',
      valueOptions: plantas,
      headerName: (
        <Tooltip title="Para dar de alta una planta, debe ir a perfil y agregar nuevo registro en domicilios">
          <span>Planta</span>
        </Tooltip>
      ),
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return plantas.find((planta) => planta.id === value)?.planta || '';
      },
      renderEditCell: (params) => {
        const filteredPlantas = plantas.filter(
          (planta) => planta.planta !== 'FISCAL',
        );
        console.log(filteredPlantas);
        return (
          <Select
            fullWidth
            value={params.value || ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'empresaDomicilioId',
                value: event.target.value,
              });
            }}
          >
            {filteredPlantas.map((planta) => {
              return (
                <MenuItem key={planta.id} value={planta.id}>
                  {planta.planta}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: 'remunerativo',
      type: 'string',
      width: 110,
      align: 'right',
      editable: true,
      headerName: 'Remunerativo',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        const formattedValue = formatValue({
          value: value?.toString(),
          groupSeparator: '.',
          decimalSeparator: ',',
          decimalScale: 2,
        });
        return formattedValue;
      },
      renderEditCell: (params) => {
        //console.log('renderEditCell-params: ', params);
        return (
          <CurrencyInput
            id={params.row.id ? 'remunerativo' + params.row.id.toString() : ''}
            className="input-currency"
            decimalScale={2}
            decimalSeparator=","
            groupSeparator="."
            value={params.value || ''}
            onValueChange={(value, name, values) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'remunerativo',
                value: values.value,
              });
            }}
          />
        );
      },
    },
    {
      field: 'noRemunerativo',
      type: 'string',
      width: 110,
      align: 'right',
      editable: true,
      headerName: 'No Remunerativo',
      headerAlign: 'left',
      headerClassName: 'header--cell',
      renderHeader: () => (
        <div style={{ textAlign: 'left', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            No
            <br />
            Remunerativo
          </span>
        </div>
      ),
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        const formattedValue = formatValue({
          value: value?.toString(),
          groupSeparator: '.',
          decimalSeparator: ',',
          decimalScale: 2,
        });
        return formattedValue;
      },
      renderEditCell: (params) => {
        console.log('renderEditCell - CurrencyInput!!');
        return (
          <CurrencyInput
            id={
              params.row.id ? 'noRemunerativo' + params.row.id.toString() : ''
            }
            className="input-currency"
            //prefix="$"
            decimalScale={2}
            decimalSeparator=","
            groupSeparator="."
            value={params.value || ''}
            onValueChange={(value, name, values) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'noRemunerativo',
                value: values.value,
              });
            }}
          />
        );
      },
    },
    {
      field: 'uomaSocio',
      type: 'singleSelect',
      width: 100,
      align: 'center',
      editable: true,
      headerName: 'Adherido Sindicato',
      headerAlign: 'center',
      headerClassName: 'header--cell',
      valueOptions: [
        { value: true, label: 'Si' },
        { value: false, label: 'No' },
      ],
      renderHeader: () => (
        <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            Adherido
            <br />
            sindicato
          </span>
        </div>
      ),
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return value ? 'Si' : 'No';
      },
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value !== null ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'uomaSocio',
                value: event.target.value,
              });
              if (event.target.value == false) {
                params.api.setEditCellValue({
                  id: params.id,
                  field: 'amtimaSocio',
                  value: false,
                });
              }
            }}
          >
            <MenuItem value={true}>Si</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'amtimaSocio',
      type: 'singleSelect',
      width: 100,
      align: 'center',
      editable: true,
      headerName: 'Paga Mutual',
      headerAlign: 'center',
      headerClassName: 'header--cell',
      valueOptions: [
        { value: true, label: 'Si' },
        { value: false, label: 'No' },
      ],
      renderHeader: () => (
        <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.8rem' }}>
          <span role="img" aria-label="enjoy">
            Paga
            <br />
            mutual
          </span>
        </div>
      ),
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return value ? 'Si' : 'No';
      },
      renderEditCell: (params) => {
        return (
          <Select
            fullWidth
            value={params.value !== null ? params.value : ''}
            onChange={(event) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'amtimaSocio',
                value: event.target.value,
              });
            }}
          >
            <MenuItem value={true}>Si</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'gErrores',
      headerName: 'Errores',
      width: 100,
      type: 'boolean',
    },
  ];

  console.log('DDJJForm - habiModif: ', habiModif);

  console.log('*x* DDJJForm - ddjjCabe: ', ddjjCabe);

  return (
    <div className="mis_alta_declaraciones_juradas_container">
      <div className="periodo_container">
        <Accordion defaultExpanded>
          <AccordionSummary
            className="paso"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Paso 1 - Indique período a presentar
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={4} direction="row" alignItems="center">
              <DemoContainer components={['DatePicker']}>
                <DesktopDatePicker
                  disableFuture
                  label={'Periodo'}
                  views={['month', 'year']}
                  closeOnSelect={true}
                  //onChange={handleChangePeriodo}

                  onChange={(date) => {
                    console.log('DesktopDatePicker.onChange-date:', date);
                    if (validarPeriodo(date)) {
                      console.log('onChange - date', date);
                      setDdjjCabe({ ...ddjjCabe, periodo: date });
                      setDdjjModi(true);
                    }
                  }}
                  //value={ddjjCabe?.periodo || ''}
                  value={ddjjCabe?.periodo == null ? '' : ddjjCabe?.periodo}
                  disabled={!habiModif}
                />
              </DemoContainer>

              <Typography> DDJJ: {tituloSec}</Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="presentacion_container">
        <Accordion>
          <AccordionSummary
            className="paso"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Paso 2 - Elija un modo de presentación
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tab}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Importar CSV - XLSX" {...a11yProps(0)} />
                <Tab label="Copiar un período anterior" {...a11yProps(1)} />
                <Tab
                  label="Carga Manual"
                  onClick={(e) => handleChangeE(e, true)}
                />
                {/*  <Tab label="Item Three" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              <Box>
                <DDJJArchivoImport
                  ddjjCabe={ddjjCabe}
                  handlerGrillaActualizar={handlerGrillaActualizarImportArchivo}
                  plantas={plantas}
                  camaras={camaras}
                  categoriasPorCamara={categorias}
                  habiModif={habiModif}
                ></DDJJArchivoImport>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
              <DDJJPeriodoAnterior
                habiModif={habiModif}
                handlerGrillaActualizar={handlerGrillaActualizarPeriodoAnterior}
              ></DDJJPeriodoAnterior>
            </CustomTabPanel>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="presentacion_container">
        <Accordion expanded={expanded} onChange={handleChangeE}>
          <AccordionSummary
            className="paso"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Paso 3 - Grilla de afiliado
          </AccordionSummary>

          <AccordionDetails>
            <Box
              sx={{
                margin: '10px 0px -20px 0px',
                height: '600px',
                width: '100%',
                '& .actions': {
                  color: 'text.secondary',
                },
                '& .textPrimary': {
                  color: 'text.primary',
                },
                '& .cold': {
                  backgroundColor: '#b9d5ff91',
                  color: '#1a3e72',
                },
                '& .hot': {
                  backgroundColor: '#ff943975',
                  color: '#1a3e72',
                },
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress />{' '}
                </Box>
              ) : (
                <ThemeProvider theme={themeWithLocale}>
                  <StripedDataGrid
                    rows={rows || []}
                    columns={columns}
                    editMode="row"
                    filterModel={filterModel}
                    //sortModel={sortModel}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={(newRowModesModel) => {
                      useGridCrud.handleRowModesModelChange(newRowModesModel);
                      setDdjjModi(true);
                    }}
                    onRowEditStop={(params) => {
                      useGridCrud.handleRowEditStop(gridApiRef, params);
                    }}
                    processRowUpdate={(newRow) => {
                      setDdjjModi(true);
                      return useGridCrud.processRowUpdate(ddjjCabe, newRow);
                    }}
                    onProcessRowUpdateError={(error) => {
                      useGridCrud.onProcessRowUpdateError(error);
                    }}
                    getRowClassName={(params) =>
                      rows?.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
                    }
                    localeText={dataGridStyle.toolbarText}
                    slots={{
                      toolbar: EditToolbar,
                    }}
                    slotProps={{
                      toolbar: {
                        setRows,
                        rows,
                        setRowModesModel,
                        showQuickFilter: true,
                        themeWithLocale,
                        filtrarGrilla,
                        gridApiRef,
                        setSortModel,
                      },
                    }}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={pageSizeOptions}
                    apiRef={gridApiRef}
                    className="afiliados"
                    columnVisibilityModel={{
                      gErrores: false,
                    }}
                    timezoneOffset={null}
                    sx={{
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                        width: '8px',
                        visibility: 'visible',
                      },
                      '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb':
                        {
                          backgroundColor: '#ccc',
                        },
                      '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                        backgroundColor: '#1A76D2 !important',
                      },
                      '& .art46--cell': {
                        backgroundColor: '#ccc',
                      },
                    }}
                    getCellClassName={getCellClassName}
                  />
                </ThemeProvider>
              )}
              <div
                style={{
                  marginTop: '20px',
                }}
              ></div>
            </Box>
            <DDJJCuilForm
              formCuilReg={formCuilReg}
              formShow={formCuilShow}
              setFormShow={setFormCuilShow}
            ></DDJJCuilForm>

            <div
              className="botones_container"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '30px',
              }}
            >
              <ThreeCircles
                visible={showLoading}
                height="25"
                width="25"
                color="#1A76D2"
                ariaLabel="three-circles-loading"
              />
              <Tooltip
                title={
                  someRowInEditMode
                    ? 'Hay filas en edición, por favor finalice la edición antes de guardar.'
                    : ''
                }
                sx={{ marginLeft: '10px', cursor: 'pointer' }}
              >
                <span>
                  <Button
                    variant="contained"
                    sx={{ padding: '6px 52px', marginLeft: '10px' }}
                    onClick={guardarDDJJConfirm}
                    disabled={deshabilitarGuardar}
                  >
                    Guardar
                  </Button>
                </span>
              </Tooltip>

              <Button
                variant="contained"
                sx={{ padding: '6px 52px', marginLeft: '10px' }}
                onClick={presentarDDJJ}
                disabled={!habiModif || !ddjjCabe.id || deshabilitarGuardar}
              >
                Presentar
              </Button>

              <Button
                variant="contained"
                sx={{ padding: '6px 52px', marginLeft: '10px' }}
                onClick={limpiarEstadoForm}
                disabled={!ddjjCabe || (!ddjjCabe.id && ddjjCabe.id == null)}
              >
                Comenzar nueva DDJJ
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};
