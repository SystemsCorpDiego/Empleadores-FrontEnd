import {
  consultarUsuarioLogueado,
  logon,
  logonDFA,
  usuarioLogueadoHabilitadoDFA,
} from './LoginApi.js';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFormLoginInternalUser } from '../../hooks/useFormLoginInternalUser.js';
import { ButtonComponent } from '@components/ButtonComponent.jsx';
import { showSwalSuccess } from './LoginShowAlert.js';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './LoginPage.css';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { ThreeCircles } from 'react-loader-spinner';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import NavBar from '@/components/navbar/NavBar.jsx';


const VITE_WELCOME_PORTAL = import.meta.env.VITE_WELCOME_PORTAL;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(true);
  const [showInternalUserForm, setShowInternalUserForm] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [showAlertUser, setShowAlertUser] = useState(false);
  const [showAlertPassword, setShowAlertPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [showInputComponent, setShowInputComponent] = useState(false);
  const { triggerSessionRefresh } = useContext(UserContext);
  /////////////////////////////////////////////////////////////////////////////////////////////
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /////////////////////////////////////////////////////////////////////////////////////////////

  const {
    user,
    passwordLoginInternalUser,
    OnInputChangeLoginInternalUser,
    OnResetFormLoginInternalUser,
  } = useFormLoginInternalUser({
    user: '',
    passwordLoginInternalUser: '',
  });

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
  }, []);

  //Link a Registrar Compania
  const redirectToRegister = () => {
    navigate('/registercompany', {
      replace: true,
    });
  };

  const redirectToRecupero = () => {
    navigate('/recupero', {
      replace: true,
    });
  };

  //Eventos para Form de Loguin (usuario-clave)
  const onInputChangeUser = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertUser(false);
  };

  const onInputChangePassword = (e) => {
    OnInputChangeLoginInternalUser(e);
    setShowAlertPassword(false);
  };

  //Submit Form de Loguin
  const onLoginInternalUser = async (e) => {
    e.preventDefault();
    if (user === '' || passwordLoginInternalUser === '') {
      if (user === '') setShowAlertUser(true);
      if (passwordLoginInternalUser === '') setShowAlertPassword(true);
      return false;
    }

    const loginDto = await logon(user, passwordLoginInternalUser);
    //console.log('ESTOY EN LA LINEA 90 RESPUESTA DE LOGINDTO');
    //console.log(loginDto); // AQUI ES DONDE SE OBTIENE EL TOKEN Y EL TOKEN DE REFRESCO

    if (loginDto && loginDto.token) {
      console.log('EXISTE loginDto.token');
      setToken(loginDto.token);
      const usuarioConDFA = await usuarioLogueadoHabilitadoDFA(loginDto.token);
      console.log('usuarioConDFA: ', usuarioConDFA); // TRUE O FALSE
      let bUsuarioConDFA = false;
      if (usuarioConDFA && usuarioConDFA.valor) {
        bUsuarioConDFA = true;
      }
      console.log(bUsuarioConDFA);
      if (bUsuarioConDFA) {
        console.log('usuarioHabilitadoDFA: TRUE !!!');
        setShowInternalUserForm(false); // Esconde el form de usuario y clave
        setShowVerificationForm(true); // Muestra el form de DFA
      } else {
        console.log('usuarioHabilitadoDFA: FALSE !!!');
        setToken(loginDto.token);
        setRefreshToken(loginDto.tokenRefresco);
        //OnResetFormLoginInternalUser();

        const usuarioLogueado = await consultarUsuarioLogueado(loginDto.token);
        console.log('usuarioLogueado: ');
        console.log(usuarioLogueado);
        

        getUsuarioLogueadoInfo(
          usuarioLogueado,
          loginDto.token,
          loginDto.tokenRefresco,
        );
        triggerSessionRefresh();
        //showSwalSuccess(VITE_WELCOME_PORTAL);
      }
    } else {
      console.log(loginDto);
      console.log('onLoginInternalUser - INIT-loginDto:NO EXISTE');
    }
    OnResetFormLoginInternalUser();
  };

  //Eventos para Form DFA  (Token)
  const onVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  //Submit Formulario DFA (Token)
  const onVerificationCodeSubmit = async (e) => {
    e.preventDefault();

    const logonDfa = await logonDFA(token, verificationCode);
    console.log('ESTOY EN LA LINEA 141 RESPUESTA DE logonDfa');

    if (logonDfa) {
      //showSwalSuccess(VITE_WELCOME_PORTAL);

      const { token, refreshToken } = logonDfa;

      const usuarioLogueado = await consultarUsuarioLogueado(token);

      getUsuarioLogueadoInfo(usuarioLogueado, token, refreshToken);
    }
  };

  //Consulta Datos Usuario Logueado
  const getUsuarioLogueadoInfo = (usuarioLogueado, token, refreshToken) => {
    console.log('usuarioInfoFinal - init');
    console.log(usuarioLogueado);
    //setSesionToken(token); // Esto disparará el useEffect del AppRouter
    if (usuarioLogueado.hasOwnProperty('usuario')) {
      usuarioLogueado.usuario.token = token;
      usuarioLogueado.usuario.tokenRefresco = refreshToken;
      triggerSessionRefresh();
      console.log(usuarioLogueado);
      navigate('/dashboard/inicio', {
        replace: true,
        state: {
          logged: true,
          usuarioLogueado,
        },
      });
      console.log('HIZO navigate() !! ');
    } else {
      console.log(
        'usuarioInfoFinal - usuarioLogueado.hasOwnProperty() = FALSE',
      );
    }
  };

  useEffect(() => {
    if (showVerificationForm) {
      const timer = setTimeout(() => {
        setShowInputComponent(true);
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showVerificationForm]); // useEffect se ejecutará cuando showVerificationForm cambie

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
        {showInternalUserForm && (
          <div className="wrapper">
            <div className="contenedor_form">
              <form onSubmit={onLoginInternalUser}>
                <h1>Iniciar Sesión</h1>
                <div className="input-group contenedor_usuario">
                  <TextField
                    type="text"
                    name="user"
                    id="user"
                    value={user}
                    onChange={onInputChangeUser}
                    autoComplete="off"
                    label="Usuario"
                    className="input_data"
                  />
                  {showAlertUser && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="error">Campo requerido</Alert>
                    </Stack>
                  )}
                </div>
                <div className="input-group">
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Contraseña
                    </InputLabel>
                    <OutlinedInput
                      type={showPassword ? 'text' : 'password'}
                      name="passwordLoginInternalUser"
                      id="passwordLoginInternalUser"
                      value={passwordLoginInternalUser}
                      onChange={onInputChangePassword}
                      autoComplete="off"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  {showAlertPassword && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="error">Campo requerido</Alert>
                    </Stack>
                  )}
                </div>
                <Button
                  variant="contained"
                  sx={{
                    marginTop:
                      showAlertUser && showAlertPassword ? '50px' : '120px',
                  }}
                  type="submit"
                  className="siguiente"
                >
                  SIGUIENTE
                </Button>
                <div className="container_btn_pass_firts">
                  <a className="link_animado" onClick={redirectToRecupero}>
                    Recupero de Contraseña
                  </a>
                  <a className="link_animado" onClick={redirectToRegister}>
                    Ingreso por primera vez
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
        {showVerificationForm && (
          <div className="wrapper">
            <div className="contenedor_form_code">
              <h1>Ingrese Token de validación</h1>

              <form onSubmit={onVerificationCodeSubmit}>
                <div className="input_group_code">
                  <ThreeCircles
                    visible={showLoading}
                    height="100"
                    width="100"
                    color="#1A76D2"
                    ariaLabel="three-circles-loading"
                    wrapperStyle={{
                      margin: '0 auto',
                    }}
                    wrapperClass=""
                  />
                  {showInputComponent && (
                    <TextField
                      type="text"
                      name="verificationCode"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={onVerificationCodeChange}
                      autoComplete="off"
                      label="Código"
                      className="input_data"
                    />
                  )}
                </div>
                <ButtonComponent
                  styles={{
                    marginTop: '157px',
                  }}
                  name={'INGRESAR'}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
