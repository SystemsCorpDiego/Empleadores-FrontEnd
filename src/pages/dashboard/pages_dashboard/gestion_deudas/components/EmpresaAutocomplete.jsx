//import React from 'react';
import { Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { axiosGestionDeudas } from '../Entidades/GestionApi';
import React, { useState } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import Swal from 'sweetalert2';

const EmpresaAutocomplete = ({
  empresas,
  cuitInput,
  nombreEmpresa,
  setCuitInput,
  setNombreEmpresa,
  buscarPorCuit,
  buscarPorNombre,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const isEditar = window.location.hash.includes('/editar');
  const isVer = window.location.hash.includes('/ver');

  const handleBuscar = () => {
    if (cuitInput) {
      buscarPorCuit(cuitInput);
    } else if (nombreEmpresa) {
      const empresa = empresas.find((e) => e.razonSocial === nombreEmpresa);
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
  const handleDescarga = async () => {
    setIsDownloading(true);
    try {
      await axiosGestionDeudas.downloadDeuda();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDescargaExcel = async () => {
    setIsDownloading(true);
    try {
      await axiosGestionDeudas.downloadExcel();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Autocomplete
        options={empresas.map((e) => e.cuit)}
        value={cuitInput || ''}
        onInputChange={(event, newInputValue) => {
          setCuitInput(newInputValue);
          const empresa = empresas.find((e) => e.cuit === newInputValue);
          if (empresa) {
            setNombreEmpresa(empresa.razonSocial);
          }
        }}
        disabled={isVer || isEditar}
        renderInput={(params) => (
          <TextField {...params} label="CUIT" variant="outlined" />
        )}
        freeSolo
        style={{ width: 200 }}
      />
      <Autocomplete
        options={empresas.map((e) => e.razonSocial)}
        value={nombreEmpresa || ''}
        onInputChange={(event, newInputValue) => {
          setNombreEmpresa(newInputValue);
          const empresa = empresas.find((e) => e.razonSocial === newInputValue);
          if (empresa) {
            setCuitInput(empresa.cuit);
          }
        }}
        disabled={isVer || isEditar}
        renderInput={(params) => (
          <TextField {...params} label="Razón Social" variant="outlined" />
        )}
        freeSolo
        style={{ width: 300 }}
      />
      {isVer || isEditar ? (
        ''
      ) : (
        <button
          onClick={handleBuscar}
          disabled={isVer || isEditar}
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
      )}

      {isDownloading ? (
        <Box display="flex" alignItems="center" gap={1}>
          <p>Descargando...</p>
          <ThreeCircles
            height="40"
            width="40"
            color="#1A76D2"
            visible={true}
            ariaLabel="descargando"
          />
        </Box>
      ) : (
        <>
          {isVer || isEditar ? (
            ''
          ) : (
            <>
              <button
                onClick={handleDescarga}
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
                Descargar Total Deudas CSV
              </button>
              <button
                onClick={handleDescargaExcel}
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
                Descargar Total Deudas XLSX
              </button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default EmpresaAutocomplete;
