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


export const GrillaPeriodo  = ({ boletas, selectedBoletas, setSelectedBoletas }) =>{
    const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

    const handleSelectionChange = (id) => {
      setSelectedBoletas((prevSelected) => {
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
        rows={boletas? boletas : []}
        columns={[
            {
                field: 'selection',
                headerName: '',
                renderCell: (params) =>{
                  return (
                    <Checkbox
                      checked={selectedBoletas.includes(params.id) }
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
          
          { field: 'numero_boleta', headerName: 'Número', flex: 0.8 },
          { field: 'concepto', headerName: 'Concepto', flex: 1 },
          {
            field: 'totalConcepto',
            headerName: 'Total Concepto',
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
            field: 'total_final',
            headerName: 'Importe Boleta',
            flex: 1,
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value);
            },
          },

        ]}
        getRowClassName={(params) =>
          boletas.indexOf(params.row) % 2 === 0 ? 'even' : ''
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