import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/navbar/NavBar';
import './RecuperarClave.css';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { recuperarClave, recuperarClaveByUsuario } from './RecuperarClaveApi';

export const RecuperarClave = () => {
  const valorRecuperacion = 'USUARIO'; // 'MAIL'
  const [valor, setValor] = useState('');
  const [mailEnvio, setMailEnvio] = useState('');
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleValorChange = (event) => {
    console.log('handleValorChange - INIT');
    setValor(event.target.value);
    console.log('handleValorChange - event.target.value:', event.target.value);
    if (valorRecuperacion == 'MAIL') {
      console.log('handleValorChange - validamail...');
      setError(!validateEmail(event.target.value));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (event) => {
    if (valorRecuperacion == 'MAIL') {
      console.log('handleSubmit -> handleSubmitMail ');
      handleSubmitMail(event);
    } else {
      console.log('handleSubmit -> handleSubmitUsuario ');
      handleSubmitUsuario(event);
    }
  };

  const handleSubmitMail = async (event) => {
    event.preventDefault();
    if (!validateEmail(valor)) {
      console.log('Email incorrecto');
      return false;
    }
    const OK = await recuperarClave(valor);
    if (OK) {
      setValor('');
      setSubmitted(true);
    }
  };

  const handleSubmitUsuario = async (event) => {
    event.preventDefault();
    const dto = await recuperarClaveByUsuario(valor);
    if (dto) {
      setMailEnvio(dto.mail);
      setValor('');
      setSubmitted(true);
    }
  };

  const textoMailEnvio = () => {
    if (valorRecuperacion == 'USUARIO' && mailEnvio != '') {
      return ` ( a ${mailEnvio}) `;
    }
    return '';
  };
  const textoValorAIngresar = () => {
    if (valorRecuperacion == 'USUARIO') {
      return 'el Usuario';
    }
    return 'el correo electrónico';
  };
  const TextFieldType = () => {
    if (valorRecuperacion == 'USUARIO') return 'text';

    return 'email';
  };
  const TextFieldLable = () => {
    if (valorRecuperacion == 'USUARIO') return 'Usuario';

    return 'Email';
  };

  return (
    <div className="container_recupero_page">
      <NavBar
        estilos={{
          backgroundColor: '#1a76d2',
        }}
        estilosLogo={{
          width: '100px',
        }}
        mostrarBtn={true}
      />
      <div className="wrapper_container_recupero">
        <div className="wrapper_recupero">
          <div className="contenedor_form_recupero">
            {submitted ? ( // Si el formulario ha sido enviado con éxito
              <div className="contenedor_form_recupero">
                <h1
                  style={{
                    marginTop: '100px',
                  }}
                >
                  ¡La ayuda está en camino!
                </h1>
                <h3>
                  Si encontramos una cuenta de usuario, te enviaremos un correo
                  electrónico {textoMailEnvio()}con más información acerca de
                  cómo restablecer tu contraseña.
                </h3>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{
                    margin: 'auto',
                    display: 'block',
                  }}
                >
                  Volver
                </Button>
              </div>
            ) : (
              // Si el formulario no ha sido enviado aún
              <div className="contenedor_form_recupero">
                <form onSubmit={handleSubmit}>
                  <h1>¿Olvidaste tu contraseña?</h1>
                  <h3>
                    Escribe {textoValorAIngresar()} con el cuál te registraste y
                    te enviaremos las instrucciones de restablecimiento.
                  </h3>
                  <div className="input_group_recupero">
                    <TextField
                      error={error}
                      helperText={error ? 'Correo electrónico incorrecto' : ''}
                      type={TextFieldType()}
                      name={TextFieldLable()}
                      id={TextFieldLable()}
                      autoComplete="off"
                      label={TextFieldLable()}
                      value={valor}
                      onChange={handleValorChange}
                    />
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: '50px',
                      alignSelf: 'flex-start',
                    }}
                    // deshabilitar el botón si el email no es válido y si no se ha ingresado nada
                    disabled={!valor || error}
                    type="submit"
                  >
                    Enviar
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
