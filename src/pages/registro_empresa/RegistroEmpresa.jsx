import { useState } from 'react';
import { useFormRegisterCompany } from '../../hooks/useFormRegisterCompany';
import { GrillaEmpresaDomicilio } from '../dashboard/pages_dashboard/datos_empresa/grilla_empresa_domicilio/GrillaEmpresaDomicilio';
import { registrarEmpresa, getRamo } from './RegistroEmpresaApi';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './RegistroEmpresa.css';
import NavBar from '@/components/navbar/NavBar';
import swal from '@/components/swal/swal';
import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { textAlign } from '@mui/system';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner';

const CustomSelect = styled(Select)({
  textAlign: 'left',
  '& .MuiSelect-select': {
    textAlign: 'left',
  },
});

const CustomMenuItem = styled(MenuItem)({
  textAlign: 'left',
});

export const RegistroEmpresa = () => {
  const [additionalEmail, setAddionalEmail] = useState([]);
  const [emailAlternativos, setEmailAlternativos] = useState([]);
  const [additionalPhone, setAdditionalPhone] = useState([]);
  const [phoneAlternativos, setPhoneAlternativos] = useState([]);
  const [idPhoneAlternativos, setIdPhoneAlternativos] = useState(2);
  const [idEmailAlternativos, setIdEmailAlternativos] = useState(2);
  const [rows, setRows] = useState([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(true);

  // Estados de tratamiento de errores
  const [errorCuit, setErrorCuit] = useState(false);
  const [errorRazonSocial, setErrorRazonSocial] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPrefijoFirst, setErrorPrefijoFirst] = useState(false);
  const [errorPhoneFirst, setErrorPhoneFirst] = useState(false);
  const [errorPrefijoSecond, setErrorPrefijoSecond] = useState(false);
  const [errorPhoneSecond, setErrorPhoneSecond] = useState(false);
  const [errorWhatsapp, setErrorWhatsapp] = useState(false);
  const [errorWhatsappPrefijo, setErrorWhatsappPrefijo] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false)

  const navigate = useNavigate();

  const {
    cuit,
    razonSocial,
    actividad_molinera,
    email_first,
    email_second,
    password,
    repeatPassword,
    prefijo_first,
    phone_first,
    prefijo_second,
    phone_second,
    whatsapp,
    whatsapp_prefijo,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany,
  } = useFormRegisterCompany({
    cuit: '',
    actividad_molinera: '',
    razonSocial: '',
    email_first: '',
    email_second: '',
    password: '',
    repeatPassword: '',
    prefijo_first: '',
    phone_first: '',
    prefijo_second: '',
    phone_second: '',
    whatsapp: '',
    whatsapp_prefijo: '',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordRepeat = () =>
    setShowPasswordRepeat((show) => !show);

  const handleMouseDownPasswordRepeat = (event) => {
    event.preventDefault();
  };

  const OnSubmitRegisterCompany = async (e) => {
    console.log('OnSubmitRegisterCompany - INIT');
    e.preventDefault();

    // Validar de que password y repeatPassword sean iguales
    if (password !== repeatPassword) {
      swal.showErrorBackEnd('Las contraseñas no coinciden', {});
      return;
    }

    let usuarioEmpresa = {
      razonSocial: razonSocial,
      cuit: cuit,
      actividad_molinera: actividad_molinera,
      clave: password,
      email: email_first,
      telefono: phone_first,
      telefono_prefijo: prefijo_first,
      whatsapp: whatsapp,
      whatsapp_prefijo: whatsapp_prefijo,
    };

    console.log('** phoneAlternativos:', phoneAlternativos);

    if (
      phoneAlternativos &&
      phoneAlternativos.length > 0 &&
      (prefijo_second || phone_second)
    ) {
      usuarioEmpresa['telefonosAlternativos'] = [
        {
          prefijo: prefijo_second,
          nro: phone_second,
          //id: 1
        },
        ...phoneAlternativos.map((phone) => ({
          prefijo: phone.prefijo,
          nro: phone.nro,
          //id: phone.id
        })),
      ];
    } else {
      if (
        phoneAlternativos &&
        phoneAlternativos.length > 0 &&
        (prefijo_second || phone_second)
      )
        usuarioEmpresa['telefonosAlternativos'] = [
          {
            prefijo: prefijo_second,
            nro: phone_second,
            //id: 1
          },
        ];
    }

    if (emailAlternativos && emailAlternativos.length > 0 && email_second) {
      usuarioEmpresa.emailAlternativos = [
        email_second,
        ...emailAlternativos.map((email) => email.email),
      ];
    } else {
      //if (emailAlternativos && emailAlternativos.length > 0 && email_second) {
      if (email_second) {
        usuarioEmpresa.emailAlternativos = [email_second];
      }
    }

    if (rows && rows.length > 0) {
      console.log('rows: ', rows);
      usuarioEmpresa['domicilios'] = rows.map((row) => ({
        tipo: row.tipo,
        provinciaId: row.provincia?.id ?? null,
        localidadId: row.localidad?.id ?? null,
        calle: row.calle,
        numeroDomicilio: row.calleNro,
        piso: row.piso,
        depto: row.depto,
        oficina: row.oficina,
        cp: row.cp,
        planta: row.planta,
      }));
    }

    console.log('RegistroEmpresa - usuarioEmpresa:', usuarioEmpresa);
    setShowLoading(true)
    const rta = await registrarEmpresa(usuarioEmpresa, navigate);
    console.log('registrarEmpresa - rta:', rta);
    //ACA
    setShowLoading(false)
    if (!rta && !rta.id) {
      if (rta.includes('cuit')) setErrorCuit(true);
      if (rta.includes('razonSocial')) setErrorRazonSocial(true);
      if (rta.includes('email')) setErrorEmail(true);
      if (rta.includes('telefono_prefijo')) setErrorPrefijoFirst(true);
      if (rta.includes('telefono')) setErrorPhoneFirst(true);
      if (rta.includes('telefono_prefijo')) setErrorPrefijoSecond(true);
      if (rta.includes('telefono')) setErrorPhoneSecond(true);
      if (rta.includes('whatsapp_prefijo')) setErrorWhatsappPrefijo(true);
      if (rta.includes('whatsapp')) setErrorWhatsapp(true);
    }
  };

  const handleAddEmail = () => {
    setIdEmailAlternativos(idEmailAlternativos + 1);

    const values = [...additionalEmail];
    const newEmail = {
      email: '',
      id: idEmailAlternativos,
    };
    values.push(newEmail);
    setEmailAlternativos([...emailAlternativos, newEmail]);
    setAddionalEmail(values);
  };

  const handleQuitEmail = (input) => {
    console.log(input);
    if (idEmailAlternativos > 2) {
      console.log(emailAlternativos);
      setEmailAlternativos(
        emailAlternativos.filter((item) => item.id !== input.id),
      );
      console.log(additionalEmail);
      setAddionalEmail(additionalEmail.filter((item) => item.id !== input.id));
    }
  };

  const handleAddPhone = () => {
    setIdPhoneAlternativos(idPhoneAlternativos + 1);

    const values = [...additionalPhone];
    const newPhone = {
      prefijo: '',
      nro: '',
      id: idPhoneAlternativos,
    };
    values.push(newPhone);
    setPhoneAlternativos([...phoneAlternativos, newPhone]);
    setAdditionalPhone(values);
  };

  const handleQuitPhone = (input) => {
    console.log(input);
    console.log(phoneAlternativos);
    if (phoneAlternativos.length > 0) {
      console.log(phoneAlternativos);
      setPhoneAlternativos(
        phoneAlternativos.filter((item) => item.id !== input.id),
      );
      console.log(additionalPhone);
      setAdditionalPhone(
        additionalPhone.filter((item) => item.id !== input.id),
      );
    }
  };

  const handleChangeCuil = (event) => {
    const inputValue = event.target.value;
    if (inputValue === '' || Number(inputValue) <= 99999999999) {
      OnInputChangeRegisterCompany(event);
    }
  };

  const handleEmailChange = (event) => {
    const inputEmail = event.target.value;
    OnInputChangeRegisterCompany(event);
    if (validateEmail(inputEmail)) {
      setErrorEmail(false);
    } else {
      setErrorEmail(true);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(emailRegex.test(email));
    return emailRegex.test(email);
  };

  const handlePasswordChange = (event) => {
    const inputPassword = event.target.value;
    OnInputChangeRegisterCompany(event);

    if (validatePassword(inputPassword)) {
      setErrorPassword(false);
      console.log(errorPassword);
    } else {
      setErrorPassword(true);
      console.log(errorPassword);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRepeatPasswordChange = (event) => {
    const inputPassword = event.target.value;
    OnInputChangeRegisterCompany(event);

    if (validateRepeatPassword(inputPassword)) {
      setErrorRepeatPassword(false);
      console.log(errorPassword);
    } else {
      setErrorRepeatPassword(true);
      console.log(errorPassword);
    }
  };
  const validateRepeatPassword = (Rpassword) => Rpassword === password;

  const handleChangePhonePrefix = (event) => {
    const inputValue = event.target.value;
    const maxDigits = 10;

    if (event.target.name === 'prefijo_first') {
      if (inputValue.length <= maxDigits - phone_first.toString().length) {
        OnInputChangeRegisterCompany(event);
      }
    }

    if (event.target.name === 'prefijo_second') {
      if (inputValue.length <= maxDigits - phone_second.toString().length) {
        OnInputChangeRegisterCompany(event);
      }
    }

    if (event.target.name === 'whatsapp_prefijo') {
      if (inputValue.length <= maxDigits - whatsapp_prefijo.toString().length) {
        if (inputValue[0] != '0') {
          OnInputChangeRegisterCompany(event);
        }
      }
    }
    //Expresion prefijoAdditional
  };

  const handleChangePhone = (event) => {
    const inputValue = event.target.value;
    const maxDigits = 10;
    if (event.target.name === 'phone_first') {
      const totalLength = inputValue.length + prefijo_first.toString().length;
      if (totalLength <= maxDigits) {
        OnInputChangeRegisterCompany(event);
      }
    }
    if (event.target.name === 'phone_second') {
      const totalLength = inputValue.length + prefijo_second.toString().length;
      if (totalLength <= maxDigits) {
        OnInputChangeRegisterCompany(event);
      }
    }

    if (event.target.name === 'whatsapp') {
      const totalLength =
        inputValue.length + whatsapp_prefijo.toString().length;
      if (totalLength <= maxDigits) {
        OnInputChangeRegisterCompany(event);
      }
      if (inputValue[0] + inputValue[1] === '15') {
        setErrorWhatsapp(true);
      } else {
        setErrorWhatsapp(false);
      }
    }
  };

  return (
    <main>
      <NavBar
        estilos={{
          backgroundColor: '#1a76d2',
        }}
        mostrarBtn={true}
      />
      <div className="registro_empresa_container">
        <form onSubmit={OnSubmitRegisterCompany} className="form">
          <div className="form_register_company">
            <h3>Formulario de registro</h3>
            <div className="input-group">
              <TextField
                error={errorCuit}
                type="number"
                name="cuit"
                value={cuit}
                onChange={handleChangeCuil}
                autoComplete="off"
                label="CUIT"
              />
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese el CUIT sin guiones ni espacios. Ejemplo: 30715478567"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <TextField
                error={errorRazonSocial}
                type="text"
                name="razonSocial"
                value={razonSocial}
                onChange={OnInputChangeRegisterCompany}
                autoComplete="off"
                label="Razón Social"
              />
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese la Razón Social de la empresa. Ejemplo: Empresa S.A."
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <FormControl fullWidth>
                <InputLabel>Pertenece a actividad Molinera</InputLabel>
                <CustomSelect
                  name="actividad_molinera"
                  value={actividad_molinera}
                  label="Pertenece a actividad Molinera"
                  onChange={OnInputChangeRegisterCompany}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <CustomMenuItem value={true}>Si</CustomMenuItem>
                  <CustomMenuItem value={false}>No</CustomMenuItem>
                </CustomSelect>
              </FormControl>
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Seleccione un valor"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <TextField
                error={errorEmail}
                type="email"
                id="email_first"
                name="email_first"
                value={email_first}
                onChange={handleEmailChange}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label="E-mail Institucional N° 1"
              />
              <span style={styContToolAst}>
                <Tooltip
                  followCursor
                  title="Ingrese el E-mail Institucional de la empresa. Ejemplo: ejemplo@empresa.com"
                  sx={{ cursor: 'pointer' }}
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <div style={styAst}>*</div>
              </span>
            </div>
            <div
              style={{
                position: 'relative',
              }}
              className="input-group"
            >
              <TextField
                error={errorEmail}
                type="email"
                id="email_second"
                name="email_second"
                value={email_second}
                onChange={handleEmailChange}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label="E-mail Alternativo N° 2"
              />
              <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"
                  style={{
                    position: 'absolute',
                    marginTop: '-48px',
                    marginLeft: '255px',
                    zIndex: '1',
                  }}
                  onClick={handleAddEmail}
                >
                  <AddIcon />
                </Fab>
              </Box>
            </div>
            {additionalEmail.map((input) => (
              <div className="input-group" key={input.id}>
                <TextField
                  type="email"
                  id={String(input.id)}
                  error={errorEmail}
                  name={`additionalEmail_${input.id}`}
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  label="Correo Electrónico Adicional"
                  value={input.email}
                  onChange={(e) => {
                    const values = [...additionalEmail];
                    values.map((item) => {
                      if (item.id === input.id) {
                        item.email = e.target.value;
                      }
                    });
                    setEmailAlternativos(values);
                  }}
                />
                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={{
                      position: 'absolute',
                      marginTop: '-48px',
                      marginLeft: '255px',
                      zIndex: '1',
                    }}
                    onClick={() => handleQuitEmail(input)}
                  >
                    <RemoveIcon />
                  </Fab>
                </Box>
              </div>
            ))}
            <div className="input-group">
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  error={errorPassword}
                  value={password}
                  onChange={handlePasswordChange}
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
                <div style={styAst}>*</div>
              </span>
            </div>
            <div className="input-group">
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Repetir Contraseña
                </InputLabel>
                <OutlinedInput
                  type={showPasswordRepeat ? 'text' : 'password'}
                  name="repeatPassword"
                  value={repeatPassword}
                  error={errorRepeatPassword}
                  onChange={handleRepeatPasswordChange}
                  autoComplete="off"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordRepeat}
                        onMouseDown={handleMouseDownPasswordRepeat}
                        edge="end"
                      >
                        {showPasswordRepeat ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <span
                style={{
                  position: 'absolute',
                  marginTop: '18px',
                  marginLeft: '515px',
                  fontSize: '20px',
                  color: 'rgb(255, 0, 0)',
                }}
              >
                *
              </span>
            </div>
            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '20%',
                  }}
                >
                  <TextField
                    error={errorPrefijoFirst}
                    type="number"
                    name="prefijo_first"
                    value={prefijo_first}
                    onChange={handleChangePhonePrefix}
                    autoComplete="off"
                    label="Prefijo"
                  />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    marginTop: '18px',
                    marginLeft: '515px',
                    fontSize: '20px',
                    color: 'rgb(255, 0, 0)',
                  }}
                >
                  *
                </span>
                <div
                  style={{
                    width: '80%',
                  }}
                >
                  <TextField
                    error={errorPhoneFirst}
                    type="text"
                    name="phone_first"
                    value={phone_first}
                    onChange={handleChangePhone}
                    autoComplete="off"
                    label="Teléfono principal N° 1"
                    inputProps={{ maxLength: 8, pattern: '[0-9]*' }}
                    sx={{
                      width: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '20%',
                  }}
                >
                  <TextField
                    error={errorPrefijoSecond}
                    type="number"
                    name="prefijo_second"
                    value={prefijo_second}
                    onChange={handleChangePhonePrefix}
                    autoComplete="off"
                    label="Prefijo"
                  />
                </div>
                <div
                  style={{
                    width: '80%',
                  }}
                >
                  <TextField
                    error={errorPhoneSecond}
                    type="text"
                    name="phone_second"
                    value={phone_second}
                    onChange={handleChangePhone}
                    autoComplete="off"
                    label="Teléfono Alternativo N° 1"
                    sx={{
                      width: '100%',
                    }}
                    inputProps={{ maxLength: 8, pattern: '[0-9]*' }}
                  />
                  <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="add"
                      style={{
                        position: 'absolute',
                        marginTop: '-48px',
                        marginLeft: '205px',
                        zIndex: '1',
                      }}
                      onClick={handleAddPhone}
                    >
                      <AddIcon />
                    </Fab>
                  </Box>
                </div>
              </div>
            </div>
            {additionalPhone.map((input) => (
              <div className="input-group" key={input.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '20%',
                    }}
                  >
                    <TextField
                      type="text"
                      name={`prefijoAdditional_${input.id}`}
                      value={input.prefijo}
                      onChange={(e) => {
                        console.log(input);
                        console.log(e.target.name);
                        const values = [...additionalPhone];
                        values.map((item) => {
                          if (item.id === input.id) {
                            item.prefijo = e.target.value;
                          }
                        });

                        setPhoneAlternativos(values);
                      }}
                      inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                      autoComplete="off"
                      label="Prefijo"
                    />
                  </div>

                  <div
                    style={{
                      width: '80%',
                    }}
                  >
                    <TextField
                      type="number"
                      name={`phoneAdditional_${input.id}`}
                      value={input.nro}
                      onChange={(e) => {
                        const values = [...additionalPhone];
                        values.map((item) => {
                          if (item.id === input.id) {
                            item.nro = e.target.value;
                          }
                        });
                        console.log(values);
                        setPhoneAlternativos(values);
                      }}
                      autoComplete="off"
                      label="Teléfono Alternativo"
                      inputProps={{ maxLength: 8, pattern: '[0-9]*' }}
                      sx={{
                        width: '100%',
                      }}
                    />
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                      <Fab
                        size="small"
                        color="primary"
                        aria-label="add"
                        style={{
                          position: 'absolute',
                          marginTop: '-48px',
                          marginLeft: '205px',
                          zIndex: '1',
                        }}
                        onClick={() => handleQuitPhone(input)}
                      >
                        <RemoveIcon />
                      </Fab>
                    </Box>
                  </div>
                </div>
              </div>
            ))}
            <div className="input-group">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '20%',
                  }}
                >
                  <TextField
                    error={errorWhatsappPrefijo}
                    type="number"
                    name="whatsapp_prefijo"
                    value={whatsapp_prefijo}
                    onChange={handleChangePhonePrefix}
                    autoComplete="off"
                    label="Prefijo"
                  />
                </div>
                <div
                  style={{
                    width: '80%',
                  }}
                >
                  <TextField
                    error={errorWhatsapp}
                    type="number"
                    name="whatsapp"
                    value={whatsapp}
                    onChange={handleChangePhone}
                    autoComplete="off"
                    label="Whatsapp"
                    sx={{
                      width: '100%',
                    }}
                  />
                </div>
                <span style={styContToolAst}>
                  <Tooltip
                    followCursor
                    title={
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        * Teléfono sin espacios ni guiones * Ejemplo (011)
                        ingresar solo 11 * Ejemplo (15609999) ingresar 609999
                      </div>
                    }
                    sx={{ cursor: 'pointer' }}
                  >
                    <IconButton>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <div style={styAst}>*</div>
                </span>
              </div>
            </div>
            <p
              style={{
                marginTop: '20px',
                marginBottom: '15px',
                color: '#18365D',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Domicilios declarados: (Para completar el registro, deberá agregar
              por lo menos el Domicilio Fiscal)
            </p>
            <ThreeCircles
              visible={showLoading}
              height="100"
              width="100"
              color="#1A76D2"
              ariaLabel="three-circles-loading"
              wrapperStyle={{
                margin: '15%',
                marginLeft: '50%',
              }}
              wrapperClass=""
            />
            { !showLoading &&<>
            <GrillaEmpresaDomicilio
              idEmpresa="REGISTRO_EMPRESA"
              rows={rows}
              setRows={setRows}
            />
            <Grid item xs={12}>
              <div className="box">
                <Button
                  //className="btn_ingresar"
                  variant="contained"
                  type="submit"
                  sx={{
                    width: 'auto',
                    marginTop: '20px',
                    padding: '15px',
                  }}
                >
                  REGISTRARSE
                </Button>
              </div>
            </Grid>
            </>
            }
          </div>
        </form>
      </div>
    </main>
  );
};

const styContToolAst = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  position: 'absolute',
  marginLeft: '500px',
  fontSize: '20px',
};

const styAst = {
  marginTop: '10px',
  color: 'rgb(255, 0, 0)',
};
