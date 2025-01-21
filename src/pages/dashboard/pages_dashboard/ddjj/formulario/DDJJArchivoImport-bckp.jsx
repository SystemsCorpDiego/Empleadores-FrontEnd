import { useState } from 'react';
import { Button, Box } from '@mui/material';
import XLSX from 'xlsx';
import formatter from '@/common/formatter';
import Swal from 'sweetalert2';
import swal from '@/components/swal/swal';
import { axiosDDJJ } from './DDJJApi';
import dayjs from 'dayjs';
import localStorageService from '@/components/localStorage/localStorageService';

export const DDJJArchivoImport = ({
  ddjjCabe,
  plantas,
  camaras,
  categoriasPorCamara, //(ex todasLasCategorias)
  handlerGrillaActualizar, //devolver los rows del archivo.-
  habiModif, //habilitacion de controles
}) => {
  console.log('DDJJArchivoImport - habiModif:', habiModif);
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const IMPORTACION_OK = import.meta.env.VITE_IMPORTACION_OK;
  const VC_CUIL = 'Cuil';
  const VC_APE = 'Apellido';
  const VC_NOM = 'Nombre';
  const VC_CAMARA = 'Camara';
  const VC_CAT = 'Categoria';
  const VC_FING = 'Fecha de ingreso';
  const VC_PLANTA = 'Planta';
  const VC_REMU = 'Remunerativo';
  const VC_NREMU = 'No Remunerativo';
  const VC_SINDICAL = 'Adherido al sindicato';
  const VC_MUTUAL = 'Paga Mutual';

  const vecRowTitulos = [
    VC_CUIL,
    VC_APE,
    VC_NOM,
    VC_CAMARA,
    VC_CAT,
    VC_FING,
    VC_PLANTA,
    VC_REMU,
    VC_NREMU,
    VC_SINDICAL,
    VC_MUTUAL,
  ];

  const [fileNameSelected, setFileNameSelected] = useState(''); // validar si eligieron un archivo
  const [fileVecCuiles, setFileVecCuiles] = useState([]); //Vector que llena "handleFileChange"
  const [btnSubirHabilitado, setBtnSubirHabilitado] = useState(false); // No se para que sirve
  const [actualizacionHabilitada, setActualizacionHabilitada] = useState(false); //habilita Import solo cuando estado 'PE'

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileNameSelected(file ? file.name : '');

    if (file) {
      console.log('VA a leer el file  !!!!');
      const reader = new FileReader();

      reader.onload = (e) => {
        const rows = readFile(e);

        console.log('readFile - rows:', rows);

        if (!validarFileColCanti(rows)) {
          event.target.value = null;
          return false;
        }

        if (!validarTitulos(rows)) {
          event.target.value = null;
          return false;
        }
        rows.shift(); //SACO 1er row: Row Titulo
        console.log(`shift() - rows: `, rows);

        castearTiposDato(rows);
        console.log(
          `handleFileChange - castearTiposDato() -return - rows: `,
          rows,
        );

        if (!validarCuilesVacios(rows)) {
          event.target.value = null;
          return false;
        }

        //console.log('rowsDatos:', rows);
        const vecRowsGridDto = castFileRowsToGrid(rows);
        //console.log('vecRowsGridDto:', vecRowsGridDto);

        setFileVecCuiles(vecRowsGridDto);
        //  console.log('handleFileChange - arrayTransformado', arrayTransformado);
        setBtnSubirHabilitado(true);
        if (ddjjCabe && ddjjCabe.id) {
          confirm(
            'Recorda que si subis un archivo, se perderan los datos de la ddjj actual',
          );
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      fileReset();
      event.target.value = null;
      console.log('file es NULO !!!!');
    }
  };

  const readFile = (e) => {
    console.log('e.target.result: ', e.target.result);
    const data = new Uint8Array(e.target.result);
    console.log('readFile - data:', data);
    const workbook = XLSX.read(data, {
      type: 'array',
      cellText: false,
      cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      dateNF: 'dd"/"mm"/"yyyy',
    });

    //Elimino rows en blanco
    console.log('readFile - rows:', rows);
    let rowsClean = rows.filter((reg) => {
      if (Array.isArray(reg) && reg?.length > 0) {
        let rta = false;
        reg.forEach(function (col, index) {
          if (typeof col !== 'undefined' && col != null) {
            rta = true;
          }
        });
        return rta;
      }
    });
    console.log('readFile - rowsClean:', rowsClean);

    return rowsClean;
  };

  const validarFileColCanti = (vecRows) => {
    const colCanti = vecRowTitulos.length;
    let rowError = false;
    let rowErrorNro = null;
    vecRows.forEach(function (row, index) {
      if (!Array.isArray(row) || row.length != colCanti) {
        rowError = false;
        rowErrorNro = index;
      }
    });
    if (rowError) {
      swal.showWarning(
        `<div><p>Registro Nro. ${rowErrorNro + 1} incompleto. Deb informar 11 columnas</p></div>`,
        true,
      );
      fileReset();
    }
    return !rowError;
  };

  const validarTitulos = (vecRows) => {
    const colCanti = vecRowTitulos.length;
    if (vecRows[0].length === colCanti) {
      try {
        const vecTitTrim = vecRows[0].map((reg) => reg.trim());
        if (
          vecTitTrim.toString().toUpperCase() ===
          vecRowTitulos.toString().toUpperCase()
        ) {
          return true;
        }
      } catch (e) {
        try {
          console.log('vecRows[0].toString(): ', vecRows[0].toString());
          console.log('vecRowTitulos.toString(): ', vecRowTitulos.toString());
        } catch (e2) {}
      }
    }

    let msgError =
      '<div><p>Formato de archivo incorrecto.<br>La primera fila debe incluir los titulos de las <b>11 columnas</b>:<br><br>';
    vecRowTitulos.map((reg, index) => {
      msgError += `${index + 1}-${reg}<br>`;
    });

    msgError = '</p></div >';
    swal.showWarning(msgError, true);
    fileReset();
    return false;
  };
  const validarCuilesVacios = (vecRows) => {
    let rowError = false;
    let rowErrorNro = false;
    const indexCuil = vecRowTitulos.indexOf(VC_CUIL);
    vecRows.forEach(function (reg, index) {
      if (reg[indexCuil] == null) {
        console.log('ERROR - reg:', reg);
        rowError = true;
        rowErrorNro = index;
      }
    });

    if (rowError) {
      swal.showWarning(
        `<div><p>Falta informa Nro de CUIL en el registro Nro. ${rowErrorNro + 1} </p></div>`,
        true,
      );
      fileReset();
    }
    console.log('validarCuilesVacios - vecRows:', vecRows);

    return !rowError;
  };

  const castearBoolean = (valor) => {
    if (valor == null || valor == undefined) {
      return null;
    }
    if (typeof valor == 'boolean') return valor;

    if (valor == 'true') {
      return true;
    }
    if (valor == 'false') {
      return false;
    } // Returns boolean
    return null;
  };
  const castearString = (valor) => {
    if (valor == undefined || valor == '') return null;

    if (typeof valor == 'number') return valor.toString();

    return valor;
  };

  const castearDate = (valor) => {
    if (valor == null || valor == undefined) {
      return null;
    }
    if (typeof valor == 'string') {
      if (dayjs(valor, 'DD/MM/YYYY', true).isValid()) {
        return valor;
      }
      if (dayjs(valor, 'DD-MM-YYYY', true).isValid()) {
        return valor;
      }
    }
    return null;
  };

  const castearFloat = (valor) => {
    if (valor == null || valor == undefined) {
      return null;
    }
    if (typeof valor == 'number') return valor;
    if (typeof valor == 'string') {
      valor = valor.trim();
      if (valor == '') return null;
      if (isNaN(valor)) return null;
      return parseFloat(valor);
    }
  };

  const castearTiposDato = (vecRows) => {
    console.log(`castearTiposDato - INIT - vecRows: ${vecRows}`);
    const vecErrores = [];
    vecRows.forEach(function (reg, index) {
      console.log(`reg: ${reg} `);

      let index2 = vecRowTitulos.indexOf(VC_CUIL);
      reg[index2] = castearString(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_SINDICAL);
      reg[index2] = castearBoolean(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_MUTUAL);
      reg[index2] = castearBoolean(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_FING);
      console.log('castearTiposDato - reg[index2]: ', reg[index2]);
      reg[index2] = castearDate(reg[index2]);
      console.log('castearTiposDato - reg[index2]: ', reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_REMU);
      reg[index2] = castearFloat(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_NREMU);
      reg[index2] = castearFloat(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_APE);
      reg[index2] = castearString(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_NOM);
      reg[index2] = castearString(reg[index2]);

      index2 = vecRowTitulos.indexOf(VC_CAMARA);
      reg[index2] = castearString(reg[index2]);
      index2 = vecRowTitulos.indexOf(VC_CAT);
      reg[index2] = castearString(reg[index2]);
      index2 = vecRowTitulos.indexOf(VC_PLANTA);
      reg[index2] = castearString(reg[index2]);
    });
    console.log(`castearTiposDato - FIN - vecRows:`, vecRows);
  };

  const findCodigo = (vector, codigo) => {
    try {
      if (vector && vector.find) {
        let reg = vector.find((reg) => reg.codigo == codigo);
        if (reg != null && reg != undefined) {
          return reg.codigo;
        }
      } else {
        console.error(
          'DDJJArchivoImport.findCodigo() - no vector, no .find() - vector: ',
          vector,
        );
      }
      return null;
    } catch (error) {
      console.error('DDJJArchivoImport.findCodigo() - error: ', error);
      return null;
    }
  };
  const findCodigoCategoria = (camara, categoria) => {
    try {
      if (categoriasPorCamara && categoriasPorCamara.find) {
        let reg = categoriasPorCamara.find(
          (reg) => reg.camara == camara && reg.categoria == categoria,
        );
        if (reg != null && reg != undefined) {
          return reg.categoria;
        }
      } else {
        console.error(
          'DDJJArchivoImport.findCodigoCategoria() - no vector, no .find() - categoriasPorCamara: ',
          categoriasPorCamara,
        );
      }
      return null;
    } catch (error) {
      console.error('DDJJArchivoImport.findCodigoCategoria() - error: ', error);
      return null;
    }
  };
  const importarAfiliado = async () => {
    //fileVecCuiles: valida los cuiles y  actualiza  nombre y apellido del arcivo con lo que hay en "Afiliados"
    console.log(
      'importarAfiliado - INIT - fileNameSelected:',
      fileNameSelected,
    );
    if (
      !fileNameSelected ||
      fileNameSelected == '' ||
      fileNameSelected == undefined
    ) {
      swal.showWarning('Debe seleccionar un archivo válido.');
      return false;
    }

    console.log('importarAfiliado - INIT - fileVecCuiles:', fileVecCuiles);
    if (!fileVecCuiles || fileVecCuiles.length == 0) {
      //no hay registros
      console.log('importarAfiliado - fileVecCuiles:', fileVecCuiles);
      swal.showWarning('El archivo seleccionado se encuentra vacío.');
      return false;
    }

    //console.log('importarAfiliado - 1 -  getCuilesValidados() ');
    const cuilesValidados = await getCuilesValidados();
    console.log('importarAfiliado - 1 -  cuilesValidados:', cuilesValidados);
    //1) Si existe cuil y no tiene errores, piso nombre y apellido.-
    //2) Si no existe cuil y tiene error de cuil, seteo gError=true

    console.log(
      'importarAfiliado - 2 -  fileVecCuilesNew - fileVecCuiles:',
      fileVecCuiles,
    );
    const fileVecCuilesNew = fileVecCuiles.map((item, index) => {
      const val = cuilesValidados.find((regValidado) => {
        regValidado.cuil == item.cuil;
      });
      //console.log('fileVecCuiles.map - val:', val);

      if (val) {
        //{cuil; inte; apellido; nombre; cuilValido;}
        if (!val.cuilValido) {
          item.gErrores = true;
        } else {
          item.nombre = val.nombre || '';
          item.apellido = val.apellido || '';
        }
      }
      return item;
    });
    console.log('importarAfiliado - 2 -  fileVecCuilesNew:', fileVecCuilesNew);

    console.log('importarAfiliado - 3 -  fileVecCuilesNew - some() ');
    // Si alguno de los cuiles tiene ERROR
    if (fileVecCuilesNew.some((item) => item.gErrores === true)) {
      const mensajesFormateados2 = fileVecCuilesNew
        .map((cuil) => {
          if (cuil.gErrores) {
            return `<p style="margin-top:20px;">
            CUIL ${cuil.cuil} con formato inválido.</p>`;
          }
        })
        .join('');

      Swal.fire({
        icon: 'error',
        title: 'Error de validacion',
        html: `Cuiles con errores:<br>${mensajesFormateados2}<br>`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      });

      setFileVecCuiles(fileVecCuilesNew);
      handlerGrillaActualizar(fileVecCuilesNew);
    } else {
      console.log('importarAfiliado - 4 -   ');
      swal.showSuccess(IMPORTACION_OK);
      setFileVecCuiles(fileVecCuilesNew);
      handlerGrillaActualizar(fileVecCuilesNew);
    }
    console.log('importarAfiliado - 5 -  FIN ');
  };
  const getCuilesValidados = async () => {
    const vecCuiles = fileVecCuiles.map((item) => item.cuil);
    const vecCuilesString = vecCuiles.map((item) => item?.toString());
    console.log('getCuilesValidados() - vecCuilesString:', vecCuilesString);
    const validacionResponse = await axiosDDJJ.validarCuiles(
      ID_EMPRESA,
      vecCuilesString,
    );

    return validacionResponse; //{cuil; inte; apellido; nombre; cuilValido;}
  };
  const castFileRowsToGrid = (fileVecDatos) => {
    const rowsGridDto = fileVecDatos
      .map((item, index) => {
        //if (item.length === 11 && item[0] !== undefined) {
        const camaraCodigo = findCodigo(camaras, item[3]);
        const categoriaCodigo = findCodigoCategoria(item[3], item[4]);
        return {
          regId: null,
          gErrores: false,

          id: index,
          cuil: item[0],
          apellido: item[1]?.toUpperCase(),
          nombre: item[2]?.toUpperCase(),
          fechaIngreso: formatter.fechaImport(item[5]),
          empresaDomicilioId: plantas.find(
            (plantas) => plantas.planta === item[6],
          )?.id,
          camara: camaraCodigo || '',
          categoria: categoriaCodigo || '',
          remunerativo: item[7],
          noRemunerativo: item[8],
          uomaSocio: item[9]?.toUpperCase() === 'SI',
          amtimaSocio: item[10]?.toUpperCase() === 'SI',
        };
        //} else {
        //console.log('arrayTransformado - Descarte: index'+index+ ' - item:', item);
        //}
      })
      .filter((item) => item !== undefined);
    return rowsGridDto;
  };

  const fileReset = () => {
    setFileNameSelected('');
    setFileVecCuiles([]);
    //setFilasDoc([]); //No se para que sirve
    setBtnSubirHabilitado(false);
  };
  //console.log('DDJJArchivoImport -INIT');

  return (
    <Box className="subir_archivo_container">
      <Box className="file-select" id="src-file1">
        <input
          type="file"
          name="src-file1"
          aria-label="Archivo"
          onChange={handleFileChange}
          accept=".csv, .xlsx"
          title=""
          //disabled={!habiModif}
        />
        <Box className="file-select-label" id="src-file1-label">
          {fileNameSelected || 'Nombre del archivo'}
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{
          padding: '6px 52px',
          width: '150px',
        }}
        onClick={importarAfiliado}
        disabled={!habiModif}
      >
        Importar
      </Button>
    </Box>
  );
};
