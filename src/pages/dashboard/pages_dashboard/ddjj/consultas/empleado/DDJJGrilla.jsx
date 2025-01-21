import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/userContext';
import Box from '@mui/material/Box';
import {
  GridRowModes,
  GridActionsCellItem,
  GridToolbar,
} from '@mui/x-data-grid';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import formatter from '@/common/formatter';
import { axiosDDJJ } from '../empresa/MisDDJJGrillaApi';
import { DDJJCrossTbl } from '../DDJJCrossTbl';
import { consultarAportesDDJJ } from '@/common/api/AportesApi';

export const DDJJGrilla = ({ rows, showCuit }) => {
  //console.log('MisDDJJGrilla - rows: ', rows);
  const [rowsGrilla, setRowsGrilla] = useState([]);
  const [colsGrilla, setColsGrilla] = useState([]);

  const [vecAportes, setVecAportes] = useState({});

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const navigate = useNavigate();

  const declaracionJuradasImpresion = async (empresaId, idDDJJ) => {
    await axiosDDJJ.imprimir(empresaId, idDDJJ);
  };

  const getColumns = () => {
    const columns = [
      {
        field: 'periodo',
        headerName: 'Periodo',
        flex: 1.5,
        editable: false,
        type: 'date',
        headerAlign: 'center',
        //align: 'center',
        align: 'right',
        headerClassName: 'header--cell',
        valueFormatter: (params) => {
          return formatter.periodo(params.value);
        },
      },
    ];

    if (showCuit) {
      columns.push(
        {
          field: 'cuit',
          headerName: 'Cuit',
          flex: 1.5,
          editable: false,
          headerAlign: 'center',
          //align: 'center',
          align: 'right',
          headerClassName: 'header--cell',
        },
        {
          field: 'razonSocial',
          headerName: 'Razon Social',
          flex: 2,
          editable: false,
          headerAlign: 'center',
          align: 'left',
          headerClassName: 'header--cell',
        },
      );
    }
    columns.push({
      field: 'secuencia',
      headerName: 'Número',
      flex: 1,
      editable: false,
      headerAlign: 'center',
      align: 'left',
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
    });
    return columns;
  };

  const addColumnAcciones = (columns) => {
    columns.push({
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      type: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            color="inherit"
            onClick={() => {
              console.log(' **** row: ', row);
              return declaracionJuradasImpresion(row.empresaId, row.id);
            }}
          />,
        ];
      },
    });
    return columns;
  };

  useEffect(() => {
    const getVecAportes = async () => {
      const data = await consultarAportesDDJJ();
      console.log('ObtenerVecAportes - data:', data);
      setVecAportes(data);
    };
    const getColumnasGrilla = () => {
      let columnas = getColumns();
      //console.log('MisDDJJGrilla - 1 - columnas:', columnas);
      columnas = DDJJCrossTbl.addColAportes(rows, columnas, vecAportes);
      //console.log('MisDDJJGrilla - 2 - columnas:', columnas);
      columnas = addColumnAcciones(columnas);
      //console.log('MisDDJJGrilla - 3 - columnas:', columnas);
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

    console.log('MisDDJJGrilla - useEffect ------------------');
    getVecAportes();

    const rowsCTblId = castConsulta();
    setRowsGrilla(rowsCTblId);

    const columnas = getColumnasGrilla();
    setColsGrilla(columnas);

    console.log('MisDDJJGrilla - useEffect ------------------');
  }, [rows]);

  //1ro seteo columans fijas
  let columnas = getColumns();
  //console.log('MisDDJJGrilla - 1 - columnas:', columnas);
  columnas = DDJJCrossTbl.addColAportes(rows, columnas, vecAportes);
  //console.log('MisDDJJGrilla - 2 - columnas:', columnas);
  columnas = addColumnAcciones(columnas);
  //console.log('MisDDJJGrilla - 3 - columnas:', columnas);

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
