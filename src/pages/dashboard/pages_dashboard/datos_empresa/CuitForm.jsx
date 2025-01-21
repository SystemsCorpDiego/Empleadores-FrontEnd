import { useEffect, useState } from 'react';
import { Box, Modal, alpha, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import axiosDatosEmpre from './DatosEmpresaApi';

export const CuitForm = ({ formShow, setFormShow, actualizarEmpresa }) => {
  const [regEmpresa, setRegEmpresa] = useState(null);
  const handleAceptar = () => {
    if (regEmpresa != null) {
      console.log('SE SELECCIONO EL REG:', regEmpresa);
      actualizarEmpresa(regEmpresa);
      setFormShow(false);
    }
  };

  const [empresas, setEmpresas] = useState([]);
  useEffect(() => {
    const ObtenerEmpresas = async () => {
      const empresas = await axiosDatosEmpre.consultarEmpresas();
      console.log('** ObtenerEmpresa - empresas: ', empresas);
      setEmpresas(empresas);
    };
    ObtenerEmpresas();
  }, []);

  return (
    <>
      <Modal
        open={formShow}
        //onClose={() => setFormShow(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            border: '2px solid #1A76D2',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h1>Seleccionar Empresa</h1>
          <br></br>
          <Grid
            container
            spacing={2}
            style={{ justify: 'center', align: 'center', textAlign: 'center' }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={empresas}
              key={(option) => option.id}
              onChange={(event, value) => {
                console.log('value:', value);
                setRegEmpresa(value);
              }}
              value={regEmpresa}
              getOptionLabel={(reg) => reg.cuit}
              sx={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="CUIT" />}
            />
            -
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={empresas}
              key={(option) => option.id}
              onChange={(event, value) => {
                console.log('value:', value);
                setRegEmpresa(value);
              }}
              value={regEmpresa}
              getOptionLabel={(reg) => reg.razonSocial}
              sx={{ width: 400 }}
              renderInput={(params) => (
                <TextField {...params} label="Razón Social" />
              )}
            />
          </Grid>
          <Grid container spacing={1} style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              onClick={() => setFormShow(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              onClick={() => handleAceptar()}
            >
              Aceptar
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
