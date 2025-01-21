import { useState, useEffect, useMemo, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Box } from '@mui/material';
import formatter from '@/common/formatter';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';

export const GrillaConvenio = ({ convenios,  }) => {
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
        rows={convenios ? convenios : []}
        columns={[
					{ field: 'estado', headerName: 'Estado', flex: 1 },
          {
            field: 'nroConvenio',
            headerName: 'Nro. Convenio',
            flex: 0.5,
          },
          {
            field: 'nroCuota',
            headerName: 'Nro Cuota',
            flex: 0.8,
          },
          {
            field: 'totalCuota',
            headerName: 'Total Cuota',
            align: 'right',
            flex: 1,
            valueFormatter: (params) =>
              params.value ? formatter.currencyString(params.value) : '',
          },
          {
            field: 'intereses',
            headerName: 'Intereses',
            flex: 1,
            align: 'right',
            valueFormatter: (params) =>
							params.value ? formatter.currencyString(params.value) : ''
          },

          {
            field: 'totalActualizado',
            headerName: 'Importe Actual',
            flex: 1,
            align: 'right',
            valueFormatter: (params) =>
							params.value ? formatter.currencyString(params.value) : ''
          },
        ]}
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
          toolbarColumns: 'Columnas',
          toolbarFilters: 'Filtros',
          toolbarExport: 'Exportar',
        }}
      />
    </Box>
  );
};
