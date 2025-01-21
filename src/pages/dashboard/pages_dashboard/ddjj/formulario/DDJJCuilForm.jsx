import { useState, useEffect } from 'react';
import { Box, Modal, alpha, TextField, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { axiosDDJJ } from './DDJJApi';

const validarApeNombre = (testo) => {
  const patron = /[A-Za-z ]/;

  for (let i = 0; i <= testo.length - 1; i++) {
    let letra = testo[i];
    if (!patron.test(letra)) {
      //console.log(testo);
      //console.log('patron.test(testo): FALSE - letra:', letra);
      return false;
    }
  }
  return true;
};

export const DDJJCuilForm = ({ formCuilReg, formShow, setFormShow }) => {
  console.log('DDJJCuilForm - formCuilReg: ', formCuilReg);
  const theme = useTheme();
  const [reg, setReg] = useState({});
  const regNew = {
    cuil: formCuilReg.cuil,
    apellido: formCuilReg.apellido,
    nombre: formCuilReg.nombre,
  };
  useEffect(() => {
    const regNew = {
      cuil: formCuilReg.cuil,
      apellido: formCuilReg.apellido,
      nombre: formCuilReg.nombre,
    };

    setReg(regNew);
  }, [formCuilReg]);

  useEffect(() => {
    console.log('-------------------------------------');
    console.log('DDJJCuilForm - formShow:', formShow);
    console.log('-------------------------------------');
  }, [formShow]);

  const handleChangeReg = (event, field) => {
    setReg((prevDataModal) => ({
      ...prevDataModal,
      [field]: event.target.value?.toUpperCase(),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const resp = await axiosDDJJ.actualizarNombreApellido(reg);
    setFormShow(false);
    console.log('handleFormSubmit - resp: ', resp);
  };

  return (
    <Modal
      open={formShow}
      //onClose={() => setFormShow(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          border: '2px solid #1A76D2',
          boxShadow: 24,
          p: 4,
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '5px',
              width: '400px',
              marginBottom: '20px',
              color: theme.palette.primary.main,
            }}
          >
            Gestión Datos DDJJ
          </Typography>
          <TextField
            fullWidth
            label="CUIL"
            value={reg.cuil}
            variant="outlined"
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            label="Apellido"
            value={reg.apellido}
            variant="outlined"
            sx={{ marginBottom: '20px' }}
            onChange={(e) => {
              console.log('TextField.onChange - e:', e.target.value);
              if (validarApeNombre(e.target.value)) {
                handleChangeReg(e, 'apellido');
              }
            }}
          />
          <TextField
            fullWidth
            label="Nombre"
            value={reg.nombre}
            variant="outlined"
            sx={{ marginBottom: '20px' }}
            onChange={(e) => {
              if (validarApeNombre(e.target.value)) {
                handleChangeReg(e, 'nombre');
              }
            }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ width: '76%' }}
          >
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              type="submit"
            >
              Enviar
            </Button>
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              onClick={() => setFormShow(false)}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
