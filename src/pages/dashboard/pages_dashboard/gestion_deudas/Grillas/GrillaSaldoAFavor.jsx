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
import { esES } from '@mui/x-data-grid';

import './Grilla.css';

export const GrillaSaldoAFavor = ({ saldoAFavor = [], selectedSaldosAFavor = [], setSelectedSaldosAFavor, isVer, cuit }) => {
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

  useEffect(() => {
    const preselected = saldoAFavor
      .filter((item) => item.convenioAjusteId !== null && item.convenioAjusteId !== undefined)
      .map((item) => item.id);

    if (preselected.length > 0 && preselected.some(id => !selectedSaldosAFavor.includes(id))) {
      setSelectedSaldosAFavor((prev) => Array.from(new Set([...prev, ...preselected])));
    }

  }, []);


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
        checkboxSelection
        disableSelectionOnClick
        rowSelectionModel={selectedSaldosAFavor}
        onRowSelectionModelChange={(newSelection) => {
          console.log("IDs seleccionados:", newSelection);
          setSelectedSaldosAFavor(newSelection);

        }}
        columns={[
          /*{
            field: 'selection',
            headerName: '',
            renderCell: (params) => (
              <Checkbox
                checked={selectedSaldosAFavor.includes(params.id)}
                //checked={params.row.convenioAjusteId !== null}
                onChange={() => handleSelectionChange(params.id)}
                disabled={isVer}
              />
            ),
            headerCheckboxSelection: true,
            checkboxSelection: true,
            flex: 0.25,
          },*/
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
              params.value ? formatter.currencyString(params.value) : '',
          }
        ]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'vigencia', sort: 'desc' }], // Cambia a 'asc' si prefieres ascendente
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
                  fileName: `${cuit}_saldos_a_favor`,
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
      />
    </Box>
  );
};
