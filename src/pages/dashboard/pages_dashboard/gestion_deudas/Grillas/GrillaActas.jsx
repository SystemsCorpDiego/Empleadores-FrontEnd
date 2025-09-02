import { useEffect, useContext } from 'react';
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

export const GrillaActas = ({ actas, selectedActas, setSelectedActas, isVer, cuit }) => {
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  return (
    <Box
      style={{ height: 400 }}
      sx={{
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#1A76D2',
          color: 'white',
        },
      }}
    >
      <DataGrid
        rows={actas ? actas : []}
        checkboxSelection
        disableSelectionOnClick
        isRowSelectable={(params) => params.row.estadoDeuda !== 'JUDICIALIZADO'}
        rowSelectionModel={selectedActas}
        onRowSelectionModelChange={(newSelection) => {
          console.log("IDs seleccionados:", newSelection);
          setSelectedActas(newSelection);

        }

        }
        columns={[
          { field: 'estadoDeuda', headerName: 'Estado', flex: 0.5 },
          {
            field: 'nroActa',
            headerName: 'Nro. Acta',
            flex: 0.5,
          },
          {
            field: 'fechaActa',
            headerName: 'Fecha Acta',
            flex: 0.8,
            valueFormatter: (params) =>
              params.value ? formatter.dateString(params.value) : '',
          },
          {
            field: 'importe',
            headerName: 'Importe Acta',
            align: 'right',
            flex: 1,
            renderCell: (params) =>
              params.row && params.row.estadoDeuda === 'JUDICIALIZADO'
                ? ''
                : formatter.currencyString(params.value),
          },
          {
            field: 'intereses',
            headerName: 'Intereses',
            align: 'right',
            flex: 1,
            renderCell: (params) =>
              params.row && params.row.estadoDeuda === 'JUDICIALIZADO'
                ? ''
                : formatter.currencyString(params.value),
          },
          {
            field: 'importeTotal',
            headerName: 'Importe Total',
            align: 'right',
            flex: 1,
            renderCell: (params) =>
              params.row && params.row.estadoDeuda === 'JUDICIALIZADO'
                ? ''
                : formatter.currencyString(params.value),
          },
        ]}
        getRowClassName={(params) =>
          actas.indexOf(params.row) % 2 === 0 ? 'even' : ''
        }
        initialState={{
          sorting: {
            sortModel: [{ field: 'fechaActa', sort: 'desc' }], // Cambia a 'asc' si prefieres ascendente
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
              <GridToolbarExport
                csvOptions={{
                  fileName: `${cuit}_actas`,
                  utf8WithBom: true
                }} />
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
        sx={{


          '& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root': {
            '&.Mui-checked': {
              height: '20px',
              width: '20px',
              border: '1px solid rgba(0, 0, 0, 0.6)',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          },
        }}
      />
    </Box>
  );
};
