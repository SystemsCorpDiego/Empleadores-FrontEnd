import { useState, useEffect } from 'react';
import { GrillaEmpresaContactoTelefono } from './GrillaEmpresaContactoTelefono';
import { GrillaEmpresaContactoMail } from './GrillaEmpresaContactoMail';
import { axiosContacto } from './GrillaEmpresaContactoApi';

export const GrillaEmpresaContacto = ({ idEmpresa }) => {
  const [rowsMail, setRowsMail] = useState([]);
  const [rowsTelefono, setRowsTelefono] = useState([]);
  const [tipoContactoMail, setTipoContactoMail] = useState([]);
  const [tipoContactoTelefono, setTipoContactoTelefono] = useState([]);

  useEffect(() => {
    const getTipoContacto = async () => {
      const tipo = await axiosContacto.obtenerTipo();
      const tipoContactoMailResponse = tipo.filter(
        (item) => item.codigo === 'MAIL' || item.codigo === 'MAIL2',
      );
      const tipoContactoTelefonoResponse = tipo.filter(
        (item) => item.codigo !== 'MAIL' && item.codigo !== 'MAIL2',
      );
      console.log(tipoContactoMail);
      console.log(tipo);
      setTipoContactoMail(tipoContactoMailResponse);
      setTipoContactoTelefono(tipoContactoTelefonoResponse);
    };
    getTipoContacto();
  }, []);

  useEffect(() => {
    const getDatosEmpresa = async () => {
      console.log('** getDatosEmpresa - idEmpresa: ' + idEmpresa);
      const datosEmpresa = await axiosContacto.obtenerDatosEmpresa(idEmpresa);
      const mailArray = datosEmpresa.filter(
        (item) => item.tipo === 'MAIL' || item.tipo === 'MAIL2',
      );
      const telefonoArray = datosEmpresa.filter(
        (item) => item.tipo !== 'MAIL' && item.tipo !== 'MAIL2',
      );
      setRowsTelefono(telefonoArray);
      setRowsMail(mailArray);
    };
    if (idEmpresa != null) getDatosEmpresa();
  }, [idEmpresa]);

  return (
    <>
      <GrillaEmpresaContactoMail
        idEmpresa={idEmpresa}
        rows={rowsMail}
        setRows={setRowsMail}
        tipoContacto={tipoContactoMail}
      />
      <GrillaEmpresaContactoTelefono
        idEmpresa={idEmpresa}
        rows={rowsTelefono}
        setRows={setRowsTelefono}
        tipoContacto={tipoContactoTelefono}
      />
    </>
  );
};
