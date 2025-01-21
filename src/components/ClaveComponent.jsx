import oAxios from '@components/axios/axiosInstace';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  IconButton,
  alpha,
  Grid,
  Tooltip,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import { patch } from './axios/EntityCrud';
import swal from './swal/swal';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
};
const styContToolAst = {
  display: 'flex',
  //alignItems: 'center',
  //justifyContent: 'center',
  //height: '100%',
  //position: 'absolute',
  //marginLeft: '500px',
  fontSize: '20px',
};
export const ClaveComponent = ({ showModal, setShowModal }) => {
  const [clave, setClave] = useState('');
  const [claveNueva, setClaveNueva] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [claveNuevaRepe, setClaveNuevaRepe] = useState('');
  const [claveNuevaRepeError, setClaveNuevaRepeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleFormSubmit = async (e) => {
    console.log('claveNueva:', claveNueva);
    if (
      claveNuevaRepe != claveNueva ||
      claveNueva == '' ||
      claveNuevaRepe == '' ||
      clave == ''
    ) {
      return false;
    }
    const URL = '/usuario/clave';
    e.preventDefault();
    const bRta = await patch(URL, { clave, claveNueva });
    setShowModal(!showModal);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (event) => {
    setClaveNueva(event.target.value);

    if (validatePassword(event.target.value)) {
      setErrorPassword(false);
      //console.log(errorPassword);
    } else {
      setErrorPassword(true);
      //console.log(errorPassword);
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(!showModal)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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
            Gestión de Clave
          </Typography>
          <span style={styContToolAst}>
            <Tooltip
              followCursor
              title="Ingrese la contraseña de la empresa. Debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial. Ejemplo: Abc12345$"
              sx={{ cursor: 'pointer' }}
            >
              <IconButton>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </span>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth margin="dense">
                <InputLabel htmlFor="clave">Clave</InputLabel>
                <OutlinedInput
                  id="clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Clave"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth margin="dense">
                <InputLabel htmlFor="clave-nueva">Nueva Clave</InputLabel>
                <OutlinedInput
                  id="clave-nueva"
                  value={claveNueva}
                  error={errorPassword}
                  //onChange={(e) => setClaveNueva(e.target.value)}
                  onChange={handlePasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Clave Nueva"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                fullWidth
                margin="dense"
                error={claveNuevaRepeError}
              >
                <InputLabel htmlFor="clave-nueva">Repetir Clave </InputLabel>
                <OutlinedInput
                  id="clave-nueva-repe"
                  value={claveNuevaRepe}
                  onChange={(e) => {
                    setClaveNuevaRepe(e.target.value);
                    setClaveNuevaRepeError(e.target.value != claveNueva);
                  }}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Clave Nueva Repe"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ width: '76%' }}
          >
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              onClick={() => setShowModal(!showModal)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{ marginTop: '20px' }}
              type="submit"
            >
              Actualizar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
