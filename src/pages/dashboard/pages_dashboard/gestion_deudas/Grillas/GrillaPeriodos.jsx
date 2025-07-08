import { useContext, useEffect, useState } from 'react';
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


export const GrillaPeriodo = ({ declaracionesJuradas, selectedDeclaracionesJuradas, setSelectedDeclaracionesJuradas }) => {
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const [aporteSolidario, setAporteSolidario] = useState(false);
  const [cuotaSocial, setCuotaSocial] = useState(false);
  const [art46, setArt46] = useState(false);

  useEffect(() => {
    declaracionesJuradas.forEach((declaracion) => {
      if (declaracion['Aporte Solidario UOMA']) {
        setAporteSolidario(true);
      }
      if (declaracion['Cuota Social UOMA']) {
        console.log('Estoy entrando no se por que')
        setCuotaSocial(true);
      }
      if (declaracion['Art. 46']) {
        setArt46(true);
      }
    });
    console.log(aporteSolidario, cuotaSocial, art46)
    

  }, [declaracionesJuradas]);

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
  return (<>
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
        rows={declaracionesJuradas ? declaracionesJuradas : []}
        columns={[
          {
            field: 'selection',
            headerName: '',
            renderCell: (params) => {
              console.log('params', params);
              console.log('selectedDeclaracionesJuradas', selectedDeclaracionesJuradas);
              return (
                <Checkbox
                  checked={selectedDeclaracionesJuradas.includes(params.id) }
                  onChange={() => handleSelectionChange(params.id)}
                />
              )
            },
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

          { field: 'rectificativa', headerName: 'Rectificativa', flex: 1 },
          aporteSolidario && {
            field: 'Aporte Solidario UOMA', headerName: 'Aporse Solidario UOMA', flex: 1,
            //visible: aporteSolidario,
            headerAlign: 'right',
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value) || 0.00;
            }
          },
          art46 && {
            field: 'Art. 46', headerName: 'Art. 46', flex: 0.7,
            //visible: art46,
            headerAlign: 'right',
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value) || 0.00;
            }
          },
          cuotaSocial && {
            field: 'Cuota Social UOMA', headerName: 'Cuota Social UOMA', flex: 1.4,
            headerAlign: 'right',
            align: 'right',
            
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value) || 0.00;
            }
          },
          {
            field: 'intereses',
            headerName: 'Intereses',
            flex: 0.7,
            headerAlign: 'right',
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value) || 0.00;
            },
          },
          {
            field: 'importeTotal',
            headerName: 'Importe Total',
            headerAlign: 'right',
            flex: 1,
            align: 'right',
            valueFormatter: (params) => {
              return formatter.currencyString(params?.value);
            },
          },

        ].filter(Boolean)}
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