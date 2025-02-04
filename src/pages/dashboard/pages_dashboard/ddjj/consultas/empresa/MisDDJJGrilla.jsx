import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/userContext';
import Box from '@mui/material/Box';
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Swal from 'sweetalert2';
import swal from '@/components/swal/swal';
import formatter from '@/common/formatter';
import { axiosDDJJ } from './MisDDJJGrillaApi';
import { DDJJCrossTbl } from '../DDJJCrossTbl';
import { consultarAportesDDJJ } from '@/common/api/AportesApi';
import localStorageService from '@/components/localStorage/localStorageService';

export const MisDDJJGrilla = ({ rows, setRows, handlerDDJJEditar }) => {
  console.log('----------------');
  console.log('MisDDJJGrilla - now: ', new Date());
  console.log('MisDDJJGrilla - rows: ', rows);
  console.log('----------------');
  const [rowsGrilla, setRowsGrilla] = useState([]);
  const [colsGrilla, setColsGrilla] = useState([]);

  const [vecAportes, setVecAportes] = useState({});

  const ID_EMPRESA = localStorageService.getEmpresaId();

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const navigate = useNavigate();

  const handleGenerarBoletaClick = (id) => () => {
    try {
      navigate(`/dashboard/generarboletas/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePresentarDDJJ = async (rowNew) => {
    const confirm = {
      titulo: 'Presentación de DDJJ',
      texto:
        'Confirma la Presentación de la Declaración Jurada para el Período <b>' +
        formatter.periodo(rowNew.periodo) +
        '</b>?',
      esHtml: true,
      reverseButtons: true,
      textoBtnOK: 'Si, Presentar !',
    };
    let minSettings = swal.getSettingConfirm(confirm);
    minSettings.reverseButtons = true;

    Swal.fire(minSettings).then(async (result) => {
      if (result.isConfirmed) {
        const data = await axiosDDJJ.presentar(ID_EMPRESA, rowNew.id);
        console.log('axiosDDJJ.presentar - data: ', data);
        if (data) {
          setRows(
            rows.map((row) => {
              if (row.id === rowNew.id) {
                row.estado = data.estado || null;
                row.secuencia = data.secuencia || null;
              }
              return row;
            }),
          );
        }
      }
    });
  };

  const handlerDDJJEditarClick = (id) => async () => {
    console.log('MisDDJJGrilla - handleEditClick - id:', id);
    handlerDDJJEditar(id);
  };

  const handleImprimirDDJJ = async (row) => {
    await axiosDDJJ.imprimir(ID_EMPRESA, row.id, row.periodo, row.secuencia);
  };

  const handleDeleteClick = (id) => async () => {
    const showSwalConfirm = async () => {
      try {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1A76D2',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Si, bórralo!',
        }).then(async (result) => {
          console.log(
            'handleDeleteClick() - ID_EMPRESA: ' + ID_EMPRESA + ' id: ' + id,
          );
          if (result.isConfirmed) {
            const bRta = await axiosDDJJ.eliminar(ID_EMPRESA, id);
            console.log('bRta: ' + bRta);
            if (bRta) {
              setRows(rows.filter((row) => row.id !== id));
            }
          }
        });
      } catch (error) {
        console.error('Error al ejecutar eliminarFeriado:', error);
      }
    };

    showSwalConfirm();
  };

  const getColumns = () => {
    let columns = [
      {
        field: 'periodo',
        headerName: 'Periodo',
        flex: 1,
        editable: false,
        type: 'date',
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'header--cell',
        valueFormatter: (params) => {
          return formatter.periodoString(params.value);
        },
      },
      {
        field: 'secuencia',
        headerName: 'Número',
        flex: 1,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'header--cell',
        valueGetter: (params) => {
          // Si secuencia es 0 es "Original" sino es "Rectificativa"+secuencia
          if (params.value === null) {
            return 'Pendiente';
          } else if (params.value === 0) {
            return 'Original';
          } else {
            return 'Rectif. ' + params.value;
          }
        },
      },
      {
        field: 'presentada',
        headerName: 'Presentación',
        flex: 1,
        editable: false,
        type: 'date',
        headerAlign: 'center',
        align: 'center',
        headerClassName: 'header--cell',
        valueFormatter: (params) => {
          return formatter.dateString(params.value);
        },
      },
    ];
    return columns;
  };

  const addColumnAcciones = (columns) => {
    columns.push({
      field: 'actions',
      headerName: 'Acciones',
      flex: 2,
      type: 'actions',
      headerAlign: 'center',
      align: 'right',
      headerClassName: 'header--cell',
      getActions: ({ id, row }) => {
        if (row.estado === 'PE') {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handlerDDJJEditarClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<LocalPrintshopIcon />}
              label="Print"
              color="inherit"
              onClick={() => handleImprimirDDJJ(row)}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        } else if (row.estado == 'PR') {
          return [
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handlerDDJJEditarClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<LocalPrintshopIcon />}
              label="Print"
              color="inherit"
              onClick={() => handleImprimirDDJJ(row)}
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handlerDDJJEditarClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<LocalPrintshopIcon />}
              label="Print"
              color="inherit"
              onClick={() => handleImprimirDDJJ(row)}
            />,
          ];
        }
      },
    });
    return columns;
  };
  const addColumnDesicion = (columns) => {
    columns.push({
      field: 'Decision',
      headerName: 'Decisión',
      flex: 2,
      type: 'actions',
      headerAlign: 'center',
      align: 'right',
      headerClassName: 'header--cell',
      getActions: ({ id, row }) => {
        if (row.estado === 'PE') {
          return [
            <Button
              sx={{
                width: '160px',
              }}
              onClick={() => handlePresentarDDJJ(row)}
              variant="contained"
            >
              Presentar
            </Button>,
          ];
        } else if (row.estado == 'PR') {
          return [
            <Button
              sx={{
                width: '160px',
                marginLeft: '-40px',
              }}
              variant="contained"
              onClick={handleGenerarBoletaClick(id)}
            >
              Generar Boleta
            </Button>,
          ];
        } else {
          return [];
        }
      },
    });
    return columns;
  };

  useEffect(() => {
    const getVecAportes = async () => {
      const data = await consultarAportesDDJJ();
      //console.log('ObtenerVecAportes - data:', data);
      setVecAportes(data);
    };
    getVecAportes();
  }, []);

  useEffect(() => {
    const getColumnasGrilla = () => {
      let columnas = getColumns();
      //console.log('MisDDJJGrilla - 1 - columnas:', columnas);
      columnas = DDJJCrossTbl.addColAportes(rows, columnas, vecAportes);
      //console.log('MisDDJJGrilla - 2 - columnas:', columnas);
      columnas = addColumnAcciones(columnas);
      //console.log('MisDDJJGrilla - 3 - columnas:', columnas);
      columnas = addColumnDesicion(columnas);
      console.log('MisDDJJGrilla - 4 - columnas:', columnas);
      return columnas;
    };
    const castConsulta = () => {
      //console.log('castConsulta - rows:', rows);
      const rowsCrossTbl = DDJJCrossTbl.castRows(rows);
      //console.log('castConsulta - rowsCrossTbl:', rowsCrossTbl);
      const rowsCTblId = rowsCrossTbl.map((item) => ({
        id: item.id,
        ...item,
      }));
      return rowsCTblId;
      //console.log('castConsulta - rowsCTblId:', rowsCTblId);
    };

    //console.log('MisDDJJGrilla - useEffect ------------------');
    //getVecAportes();

    const rowsCTblId = castConsulta();
    setRowsGrilla(rowsCTblId);

    const columnas = getColumnasGrilla();
    setColsGrilla(columnas);

    //console.log('MisDDJJGrilla - useEffect ------------------');
  }, [rows, vecAportes]);

  /*
  //1ro seteo columans fijas
  let columnas = getColumns();
  //console.log('MisDDJJGrilla - 1 - columnas:', columnas);
  columnas = DDJJCrossTbl.addColAportes(rows, columnas, vecAportes);
  //console.log('MisDDJJGrilla - 2 - columnas:', columnas);
  columnas = addColumnAcciones(columnas);
  //console.log('MisDDJJGrilla - 3 - columnas:', columnas);
  columnas = addColumnDesicion(columnas);
  //console.log('MisDDJJGrilla - 4 - columnas:', columnas);
  */

  return (
    <div
      style={{
        marginTop: 50,
        height: 400,
        width: '100%',
      }}
    >
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
        <StripedDataGrid
          rows={rowsGrilla}
          columns={colsGrilla}
          editMode="row"
          getRowClassName={(params) =>
            rowsGrilla.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
          }
          localeText={dataGridStyle.toolbarText}
          slots={{
            toolbar: GridToolbar,
          }}
          sx={{
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
              width: '8px',
              visibility: 'visible',
            },
            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
            },
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
        />
      </Box>
    </div>
  );
};
