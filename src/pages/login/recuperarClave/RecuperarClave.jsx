import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/navbar/NavBar';
import './RecuperarClave.css';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { recuperarClave } from './RecuperarClaveApi';

export const RecuperarClave = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(!validateEmail(event.target.value));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      const OK = await recuperarClave(email);
      if (OK) {
        setEmail('');
        setSubmitted(true);
      }
    } else {
      console.log('Email incorrecto');
    }
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
                  electrónico con más información acerca de cómo restablecer tu
                  contraseña.
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
                    Escribe el correo electrónico con el cuál te registraste y
                    te enviaremos las instrucciones de restablecimiento.
                  </h3>
                  <div className="input_group_recupero">
                    <TextField
                      error={error}
                      helperText={error ? 'Correo electrónico incorrecto' : ''}
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="off"
                      label="Email"
                      value={email}
                      onChange={handleEmailChange}
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
                    disabled={!email || error}
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
