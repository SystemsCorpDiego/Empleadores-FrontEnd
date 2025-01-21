import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useContext } from 'react';
import './../../../login/LoginPage.css';
import NavBar from '@/components/navbar/NavBar.jsx';
import { CheckCircle, Error } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';

import { axiosUsuaEmpreActivacion } from './usuaEmpreActivacionApi';

export const UsuaEmpreActivacion = () => {
  const { token } = useParams();
  const [activacion, setActivacion] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    const activarToken = async () => {
      console.log(
        'xxx - activarToken - axiosUsuaEmpreActivacion.activar -  token: ',
        token,
      );
      const response = await axiosUsuaEmpreActivacion.activar(token);
      console.log('activarToken - response: ', response);

      if (response && response.usuario) {
        console.log('UsuaEmpreActivacion - ENTRO a setear setActivacion ');
        setActivacion(
          `El usuario ${response.usuario} fue activado correctamente`,
        );
      } else {
        console.log('UsuaEmpreActivacion - NO ENTRO ...');
        setActivacion(`El token de activacion informado es incorrecto.`);
      }
    };

    activarToken();
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
            <Box display="flex" alignItems="center">
              <Typography variant="h1">{activacion}</Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
            <a href="http://localhost:5173/">
              <Button variant="contained"> Ir al loguin </Button>
              </a>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};
