import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Box, Checkbox } from '@mui/material';
import formatter from '@/common/formatter';
import { esES } from '@mui/x-data-grid';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import './Grilla.css';

export const GrillaPeriodo = ({
  declaracionesJuradas,
  selectedDeclaracionesJuradas,
  setSelectedDeclaracionesJuradas,
  isVer
}) => {
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const handleSelectionChange = (id) => {
    setSelectedDeclaracionesJuradas((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id],
    );
  };

  const COLUMNAS_FIJAS = [
    {
      field: 'selection',
      headerName: '',
      renderCell: (params) => (
        <Checkbox
          checked={selectedDeclaracionesJuradas.includes(params.id)}
          onChange={() => handleSelectionChange(params.id)}
          disabled={isVer}
        />
      ),
      headerCheckboxSelection: true,
      checkboxSelection: true,
      flex: 0.25,
    },
    {
      field: 'periodo',
      headerName: 'Periodo',
      flex: 0.8,
      valueFormatter: (params) => formatter.periodoString(params.value),
    },
    {
      field: 'rectificativa',
      headerName: 'Rectificativa',
      flex: 0.5,
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
  ];

  const COLUMNAS_NUMERICAS_FINALES = [
    {
      field: 'intereses',
      headerName: 'Intereses',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (params) =>
        formatter.currencyString(params?.value) || 0.0,
    },
    {
      field: 'importeTotal',
      headerName: 'Importe Total',
      headerAlign: 'right',
      flex: 1,
      align: 'right',
      valueFormatter: (params) => formatter.currencyString(params?.value),
    },
  ];
  const generarColumnasDinamicas = (data) => {
    const columnasExcluidas = new Set([
      'id',
      'periodo',
      'rectificativa',
      'intereses',
      'importeTotal',
      'convenioDdjjId',
    ]);

    const columnasDetectadas = new Set();

    data.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'number' && !columnasExcluidas.has(key)) {
          columnasDetectadas.add(key);
        }
      });
    });

    const columnasDinamicas = [...columnasDetectadas].map((key) => ({
      field: key,
      headerName: key,
      flex: 1.4,
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (params) =>
        formatter.currencyString(params?.value) || 0.0,
    }));

    return [
      ...COLUMNAS_FIJAS,
      ...columnasDinamicas,
      ...COLUMNAS_NUMERICAS_FINALES,
    ];
  };

  return (
    <Box
      style={{ height: 400, width: '100%' }}
      sx={{
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#1A76D2',
          color: 'white',
        },
      }}
    >
      <DataGrid
        rows={declaracionesJuradas || []}
        columns={generarColumnasDinamicas(declaracionesJuradas || [])}
        getRowClassName={(params) =>
          declaracionesJuradas.indexOf(params.row) % 2 === 0 ? 'even' : ''
        }
        initialState={{
          sorting: {
            sortModel: [{ field: 'periodo', sort: 'desc' }], // Cambia a 'asc' si prefieres ascendente
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarExport />
            </GridToolbarContainer>
          ),
        }}
        localeText={{
          ...esES.components.MuiDataGrid.defaultProps.localeText,
          toolbarDensity: 'Densidad',
          toolbarDensityLabel: 'Densidad',
          toolbarDensityCompact: 'Compacto',
          toolbarDensityStandard: 'Estándar',
          toolbarDensityComfortable: 'Cómodo',
          footerRowsPerPage: 'Filas por página',
          noRowsLabel: 'Sin filas',
          toolbarColumns: 'Columnas',
          toolbarFilters: 'Filtros',
          toolbarExport: 'Exportar',
        }}
      />
    </Box>
  );
};
