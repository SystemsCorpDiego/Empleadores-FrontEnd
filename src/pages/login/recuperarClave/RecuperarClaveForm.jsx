import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import '../LoginPage.css';
import NavBar from '@/components/navbar/NavBar.jsx';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  alpha,
  TextField,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { RecuperarClaveFormApi } from './RecuperarClaveFormApi';

export const RecuperarClaveForm = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const theme = useTheme();
  const [tokenDatos, setTokenDatos] = useState(null);
  const [clave, setClave] = useState(null);
  const [claveNueva, setClaveNueva] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [claveNuevaRepeError, setClaveNuevaRepeError] = useState(false);
  const [claveNuevaRepe, setClaveNuevaRepe] = useState('');
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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleFormSubmit = async (e) => {
    console.log('handleFormSubmit - claveNueva:', claveNueva);
    e.preventDefault();
    if (
      claveNuevaRepe != claveNueva ||
      claveNueva == '' ||
      claveNuevaRepe == ''
    ) {
      return false;
    }
    const bRta = await RecuperarClaveFormApi.cambiarClave(token, claveNueva);
    if (bRta && bRta == true) {
      navigate('/login', {
        replace: true,
      });
    }
    return true;
  };

  useEffect(() => {
    const consultarToken = async () => {
      console.log('consultarToken - token: ', token);
      const response = await RecuperarClaveFormApi.consultar(token);
      console.log('consultarToken - response: ', response);

      if (response && response.usuario) {
        setTokenDatos(response);
      }
    };

    consultarToken();
  }, []);

  return (
    <div className="container_login_page">
      <NavBar
        estilos={{
          backgroundColor: '#1a76d2',
        }}
        estilosLogo={{
          width: '100px',
        }}
        mostrarBtn={false}
      />
      <div className="wrapper_container">
        <div className="wrapper_token">
          <div className="contenedor_form_code">
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

                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    textAlign: 'center',
                    borderRadius: '5px',
                    width: '400px',
                    marginBottom: '20px',
                    color: theme.palette.primary.main,
                  }}
                >
                  <b>Usuario: </b>
                  {tokenDatos?.usuario || ''}
                </Typography>

                <Grid container spacing={2}>
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
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
                      <InputLabel htmlFor="clave-nueva">
                        Repetir Clave{' '}
                      </InputLabel>
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Clave Nueva Repe"
                      />
                      <Tooltip
                        followCursor
                        title="Ingrese la contraseña de la empresa. Debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial. Ejemplo: Abc12345$"
                        sx={{ cursor: 'pointer' }}
                      >
                        <IconButton>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
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
                    onClick={() =>
                      navigate('/login', {
                        replace: true,
                      })
                    }
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
          </div>
        </div>
      </div>
    </div>
  );
};
