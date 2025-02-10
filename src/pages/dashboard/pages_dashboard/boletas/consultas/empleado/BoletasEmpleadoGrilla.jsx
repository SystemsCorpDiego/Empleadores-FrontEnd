import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import { GridToolbar } from '@mui/x-data-grid';
import { Print as PrintIcon } from '@mui/icons-material';
import formatter from '@/common/formatter';
import { IconButton, Box } from '@mui/material';
import { boletaPdfDownload } from '@/common/api/BoletaCommonApi';

export const BoletasEmpleadoGrilla = ({ rowsGrilla }) => {
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);

  const getColumns = () => {
    const columns = [
      {
        field: 'cuit',
        headerName: 'Cuit',
        flex: 0.8,
      },
      {
        field: 'razonSocial',
        headerName: 'Razon Social',
        flex: 0.8,
      },
      {
        field: 'periodo',
        headerName: 'Periodo',
        flex: 0.8,
        valueFormatter: (params) => formatter.periodoString(params.value),
      },
      { field: 'tipo_ddjj', headerName: 'Tipo DDJJ', flex: 1 },
      { field: 'numero_boleta', headerName: 'Número', flex: 0.8 },
      { field: 'descripcion', headerName: 'Concepto', flex: 1 },
      {
        field: 'total_final',
        headerName: 'Importe Boleta',
        flex: 1,
        align: 'right',
        valueFormatter: (params) => {
          return formatter.currencyString(params?.value);
        },
      },
      {
        field: 'importe_recibido',
        headerName: 'Importe Recibido',
        flex: 1,
        align: 'right',
        valueFormatter: (params) => {
          return formatter.currencyString(params?.value);
        },
      },
      {
        field: 'fecha_de_pago',
        headerName: 'Fecha de Pago',
        flex: 1,
        valueFormatter: (params) =>
          params.value ? formatter.dateString(params.value) : '',
      },
      {
        field: 'formaDePago',
        headerName: 'Medio de Pago',
        flex: 0.8,
      },
      {
        field: 'acciones',
        headerName: 'Acciones',
        flex: 1,
        renderCell: (params) => {
          return (
            <>
              <IconButton
                size="small"
                title="Imprimir"
                onClick={() => {
                  console.log('params.row:', params.row);

                  boletaPdfDownload(
                    params.row.empresaId,
                    params.row.id,
                    params.row.numero_boleta,
                  );
                }}
              >
                <PrintIcon />
              </IconButton>
            </>
          );
        },
      },
    ];
    return columns;
  };

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
          width: '100%%',
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
          columns={getColumns()}
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
