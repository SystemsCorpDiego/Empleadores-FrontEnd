import { useState, useEffect, useMemo, useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Box, Checkbox } from '@mui/material';
import formatter from '@/common/formatter';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import './Grilla.css';

export const GrillaSaldoAFavor = ({ saldoAFavor = [], selectedSaldosAFavor = [], setSelectedSaldosAFavor }) => {
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

    const handleSelectionChange = (id) => {
        setSelectedSaldosAFavor((prevSelected) => {
          console.log(prevSelected);
          if (prevSelected.includes(id)) {
            return prevSelected.filter((selectedId) => selectedId !== id);
          } else {
            return [...prevSelected, id];
          }
        });
    
      };

        useEffect(() => {  console.log(selectedSaldosAFavor) }, [selectedSaldosAFavor]);


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
        rows={saldoAFavor ? saldoAFavor : []}
        columns={[
          {
            field: 'selection',
            headerName: '',
            renderCell: (params) => (
              <Checkbox
          checked={params.row.convenioAjusteId !== null}
          onChange={() => handleSelectionChange(params.id)}
              />
            ),
            headerCheckboxSelection: true,
            checkboxSelection: true,
            flex: 0.25,
          },
          {
            field: 'vigencia',
            headerName: 'Fecha',
            flex: 0.5,
            valueFormatter: (params) =>
              params.value ? formatter.dateString(params.value) : '',
          },
          {
            field: 'motivo',
            headerName: 'Concepto',
            flex: 0.8,
          },
          {
            field: 'importe',
            headerName: 'Importe',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            valueFormatter: (params) =>
              params.value ? formatter.currencyString(params.value * -1) : '',
          }
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
