import { useContext } from 'react';
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
import './Grilla.css'


export const GrillaPeriodo  = ({ declaracionesJuradas, selectedDeclaracionesJuradas, setSelectedDeclaracionesJuradas }) =>{
    const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

    const handleSelectionChange = (id) => {
      setSelectedDeclaracionesJuradas((prevSelected) => {
        console.log(prevSelected)
        if (prevSelected.includes(id)) {
          return prevSelected.filter((selectedId) => selectedId !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    };
    return(<>
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
        rows={declaracionesJuradas? declaracionesJuradas : []}
        columns={[
            {
                field: 'selection',
                headerName: '',
                renderCell: (params) =>{
                  return (
                    <Checkbox
                      checked={selectedDeclaracionesJuradas.includes(params.id) }
                      onChange={() => handleSelectionChange(params.id)}
                    />
                  )
                } ,
                headerCheckboxSelection: true,
                checkboxSelection: true,
                flex: 0.25
              },
          {
            field: 'periodo',
            headerName: 'Periodo',
            flex: 0.8,
            valueFormatter: (params) =>
              formatter.periodoString(params.value),
          },
          
          { field: 'rectificativa', headerName: 'Rectificativa', flex: 0.8 },
          { field: 'aporteCodigo', headerName: 'Codigo Aporte', flex: 1 },
          { field: 'aporteDescripcion', headerName: 'Descripción Aporte', flex: 1 },
          {
            field: 'importe',
            headerName: 'Importe',
            flex: 1,
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value);
            },
          },
          {
            field: 'interes',
            headerName: 'Intereses',
            flex: 1,
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value);
            },
          },
          {
            field: 'importeTotal',
            headerName: 'Importe Total',
            flex: 1,
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value);
            },
          },

        ]}
        getRowClassName={(params) =>
          declaracionesJuradas.indexOf(params.row) % 2 === 0 ? 'even' : ''
        }
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
    </>)
}