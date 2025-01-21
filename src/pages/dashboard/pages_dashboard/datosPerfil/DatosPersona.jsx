import './DatosPersona.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, TextField, Tabs, Tab } from '@mui/material';
import localStorageService from '@components/localStorage/localStorageService';
import { useState } from 'react';
import { axiosPersonaLogueda } from './DatosPersonaApi.js';

export const DatosPersona = () => {
  const rol = localStorageService.getRol();
  const usuario = localStorageService.getUsuario();
  const [apellido, setApellido] = useState(localStorageService.getApellido());
  const [nombre, setNombre] = useState(localStorageService.getNombre());
  const [mail, setMail] = useState(localStorageService.getMail());

  const onSubmitClick = async (e) => {
    e.preventDefault();
    const personaDto = {
      apellido: apellido,
      nombre: nombre,
      email: mail,
      id: '',
    };
    console.log('personaDto:', personaDto);
    console.log('e:', e);
    const rta = await axiosPersonaLogueda.actualizar(personaDto);
    if (rta) {
      console.log('onSubmitClick - rta:', rta);
    }
    return false;
  };

  console.log('DatosPersona - INIT');
  return (
    <div className="datos_container">
      <h1>Mis Datos de Perfil</h1>
      <form
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          alignContent: 'center',
          margin: '50px auto',
        }}
        onSubmit={onSubmitClick}
      >
        <Box sx={{ flexGrow: 1 }} style={{ marginLeft: '5%' }}>
          <Grid container spacing={2}>
            <Grid
              xs={8}
              justifyContent="center"
              alignItems="center"
              className="item"
            >
              <TextField
                label="Usuario"
                type="text"
                name="usuario"
                disabled={true}
                value={usuario}
                //onChange={OnChangeRazonSocial}
                autoComplete="off"
                //label="Usuario"
                sx={{
                  width: '200px',
                }}
              />

              <TextField
                label="Rol Asignado"
                type="text"
                name="rol"
                disabled={true}
                value={rol}
                //onChange={OnChangeRazonSocial}
                autoComplete="off"
                //label="Rol"
                sx={{
                  width: '250px',
                }}
              />
            </Grid>
            <Grid xs={10} className="item">
              <TextField
                label="Apellido"
                type="text"
                name="apellido"
                value={apellido}
                /// onChange={OnChangeCuit}
                onChange={(e) => setApellido(e.target.value)}
                autoComplete="off"
                sx={{
                  width: '350px',
                }}
              />
            </Grid>
            <Grid xs={10} className="item">
              <TextField
                label="Nombre"
                type="text"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="off"
                sx={{
                  width: '350px',
                }}
              />
            </Grid>
            <Grid xs={10} style={{ padding: 10 }}>
              <TextField
                label="Mail"
                type="text"
                name="mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                autoComplete="off"
                sx={{
                  width: '350px',
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Button variant="contained" type="submit">
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </div>
  );
};
