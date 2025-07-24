import React from 'react';
import { Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const EmpresaAutocomplete = ({
  empresas,
  cuitInput,
  nombreEmpresa,
  setCuitInput,
  setNombreEmpresa,
  buscarPorCuit,
  buscarPorNombre
}) => {
  const handleBuscar = () => {
    if (cuitInput) {
      buscarPorCuit(cuitInput);
    } else if (nombreEmpresa) {
      const empresa = empresas.find(e => e.razonSocial === nombreEmpresa);
      if (empresa) {
        setCuitInput(empresa.cuit);
        buscarPorNombre(nombreEmpresa);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Ingrese un CUIT o Razón Social',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Autocomplete
        options={empresas.map(e => e.cuit)}
        value={cuitInput || ''}
        onInputChange={(event, newInputValue) => {
          setCuitInput(newInputValue);
          const empresa = empresas.find(e => e.cuit === newInputValue);
          if (empresa) {
            setNombreEmpresa(empresa.razonSocial);
          }
        }}
        renderInput={(params) => <TextField {...params} label="CUIT" variant="outlined" />}
        freeSolo
        style={{ width: 200 }}
      />
      <Autocomplete
        options={empresas.map(e => e.razonSocial)}
        value={nombreEmpresa || ''}
        onInputChange={(event, newInputValue) => {
          setNombreEmpresa(newInputValue);
          const empresa = empresas.find(e => e.razonSocial === newInputValue);
          if (empresa) {
            setCuitInput(empresa.cuit);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Razón Social" variant="outlined" />}
        freeSolo
        style={{ width: 300 }}
      />
      <button
        onClick={handleBuscar}
        style={{
          padding: '8px 20px',
          fontSize: '16px',
          borderRadius: '4px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          height: '56px',
        }}
      >
        Buscar
      </button>
    </Box>
  );
};

export default EmpresaAutocomplete;