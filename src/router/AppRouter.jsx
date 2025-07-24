import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { getRol } from '@/components/localStorage/localStorageService';
import { getFuncionalidadesByRol } from '@/pages/dashboard/DashboardPageApi';

import { useEffect, useState, useContext } from 'react';
import localStorageService from '@/components/localStorage/localStorageService';

import { UserContext } from '@/context/userContext';
import { Inicio } from '../pages/dashboard/pages_dashboard/inicio/Inicio';
import NavBar from '../components/navbar/NavBar';
import { DatosEmpresa } from '../pages/dashboard/pages_dashboard/datos_empresa/DatosEmpresa';
import { DatosPerfil } from '@/pages/dashboard/pages_dashboard/datosPerfil/DatosPerfil';
import { Publicaciones } from '../pages/dashboard/pages_dashboard/publicaciones/Publicaciones';

import { RecuperarClave } from '@/pages/login/recuperarClave/RecuperarClave';
import { RecuperarClaveForm } from '@/pages/login/recuperarClave/RecuperarClaveForm';
import DashboardPage from '../pages/dashboard/DashboardPage';
import { LoginPage } from '../pages/login/LoginPage';
import { Feriados } from '../pages/dashboard/pages_dashboard/feriados/Feriados';
import { UsuarioInterno } from '../pages/dashboard/pages_dashboard/usuarioInterno/usuarioInterno';
import { RegistroEmpresa } from '../pages/registro_empresa/RegistroEmpresa';
import { CuitsRestringidos } from '../pages/dashboard/pages_dashboard/cuits-restringidos/CuitsRestringidos';
import { Boletas } from '../pages/dashboard/pages_dashboard/boletas/Boletas';

import { BoletaEmpleadoFiltro } from '../pages/dashboard/pages_dashboard/boletas/consultas/empleado/BoletaEmpleadoFiltro';

import { DetalleBoleta } from '@/pages/dashboard/pages_dashboard/boletas/DetalleBoleta';
import { Roles } from '@/pages/dashboard/pages_dashboard/roles/Roles';
import { GenerarBoletas } from '@/pages/dashboard/pages_dashboard/generar_boletas/GenerarBoletas';
import { GenerarOtrosPagos } from '@/pages/dashboard/pages_dashboard/otros_pagos/GenerarOtrosPagos';
import { DetalleOtrosPagos } from '@/pages/dashboard/pages_dashboard/otros_pagos/DetalleOtrosPagos';
import { DDJJFiltro } from '@/pages/dashboard/pages_dashboard/ddjj/consultas/empleado/DDJJFiltro';
import { InteresesAfip } from '@/pages/dashboard/pages_dashboard/intereses_afip/InteresesAfip';
import { Ajustes } from '@/pages/dashboard/pages_dashboard/ajustes/Ajustes';
import { GestionRoles } from '@/pages/dashboard/pages_dashboard/gestionRoles/gestionRoles';
import { UsuaEmpreActivacion } from '@/pages/dashboard/pages_dashboard/usuarioEmpresa/usuaEmpreActivacion';
import { Aportes } from '@/pages/dashboard/pages_dashboard/aportes/Aportes';
import { DDJJTabs } from '@/pages/dashboard/pages_dashboard/ddjj/DDJJTabs';
import { UserProvider } from '@/context/userProvider';
import { GestionDeudas } from '@/pages/dashboard/pages_dashboard/gestion_deudas/GestionDeudas';
import { Convenios } from '@/pages/dashboard/pages_dashboard/convenios/Convenios';
import { Cuotas } from '@/pages/dashboard/pages_dashboard/convenios/cuotas/Cuotas';
import { ParametrosConvenios } from '@/pages/dashboard/pages_dashboard/ParametrosConvenios/ParametrosConvenios';



const PagosPage = () => (
  <div className="otros_pagos_container">Contenido de la página de pagos</div>
);

const AppRouter = () => {

  const [rol, setRol] = useState(null);

  const [rolFuncionalidades, setRolFuncionalidades] = useState({});
  const { sessionVersion } = useContext(UserContext);
  useEffect(() => {
    console.log('Se dispara el useEffect de AppRouter');
    const fetchData = async () => {
      const nuevoRol = localStorageService.getRol();
      if (nuevoRol === rol) return;
      setRol(nuevoRol);
      if (nuevoRol !== null && nuevoRol !== undefined) {
        const { funcionalidades } = await getFuncionalidadesByRol(nuevoRol);
        const roles = {};
        funcionalidades.forEach((f) => {
          roles[f.descripcion] = f.activo;
        });
        setRolFuncionalidades(roles);
      }
    };

    fetchData();
  }, [sessionVersion, rol]);
  return (
    
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="recupero" element={<RecuperarClave />} />
        <Route
          path="usuario/empresa/activar/:token"
          element={<UsuaEmpreActivacion />}
        />
        <Route
          path="usuario/recuperar-clave/:token"
          element={<RecuperarClaveForm />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route
            path="inicio"
            index
            element={
              <Inicio />
            }
          />
          <Route
            path="publicaciones"
            element={
              rolFuncionalidades.PUBLICACIONES ? <Publicaciones /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="feriados"
            element={
              rolFuncionalidades.FERIADOS ? <Feriados /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="ddjj"
            element={
              rolFuncionalidades.DDJJ_CONSULTA ? <DDJJTabs /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="ddjj/alta"
            element={
              rolFuncionalidades.NUEVA_DDJJ ? <DDJJTabs /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="ddjj/consulta"
            element={
              rolFuncionalidades.MIS_DDJJ ? <DDJJTabs /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="ddjjconsultaempleado"
            element={
              rolFuncionalidades.DDJJ_CONSULTA ? <DDJJFiltro /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="boletas/empleado/consulta"
            element={
              rolFuncionalidades.BOLETAS_CONSULTA ? <BoletaEmpleadoFiltro /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="boletas"
            element={
              rolFuncionalidades.MIS_BOLETAS ? <Boletas /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="boletas/periodos"
            element={
              rolFuncionalidades.MIS_BOLETAS ? <Boletas /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="boletas/Actas"
            element={
              rolFuncionalidades.ACTAS_CONSULTA ? <Boletas /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="boletas/nueva"
            element={
              rolFuncionalidades.MIS_BOLETAS ? <Boletas /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="pagos"
            element={
              rolFuncionalidades.PAGOS_CONSULTA ? <PagosPage /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="misdatos"
            element={
              rolFuncionalidades.DATOS_PERFIL ? <DatosPerfil /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="datos/usuario"
            element={
              rolFuncionalidades.DATOS_PERFIL ? <DatosPerfil /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="empresas"
            element={
              rolFuncionalidades.CONSULTA_EMPRESA ? <DatosEmpresa /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="usuariointerno"
            element={
              rolFuncionalidades.USUARIO_INTERNO ? <UsuarioInterno /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="cuitsrestringidos"
            element={
              rolFuncionalidades.CUITS_RESTRINGIDOS ? <CuitsRestringidos /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="roles"
            element={
              rolFuncionalidades.ROLES ? <Roles /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="generarboletas/:id"
            element={
              rolFuncionalidades.MIS_DDJJ ? <GenerarBoletas /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="detalleboleta/:numero_boleta"
            element={
              rolFuncionalidades.DETALLE_BOLETA ? <DetalleBoleta /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="generarotrospagos"
            element={
              rolFuncionalidades.BOLETA_ACTAS ? <GenerarOtrosPagos /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="detalleotrospagos"
            errorElement={
              rolFuncionalidades.BOLETA_ACTAS ? <DetalleOtrosPagos /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="interesesafip"
            element={
              rolFuncionalidades.INTERESES ? <InteresesAfip /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="ajustes"
            element={
              rolFuncionalidades.AJUSTES ? <Ajustes /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="gestion-roles"
            element={
              rolFuncionalidades.GESTION_ROLES ? <GestionRoles /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="aportes"
            element={
              rolFuncionalidades.APORTES ? <Aportes /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="parametros-convenios"
            element={
              rolFuncionalidades.PARAMETROS_CONVENIOS ? <ParametrosConvenios /> : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="gestiondeuda"
            element={
              rolFuncionalidades.GESTION_DEUDA
                ? <GestionDeudas />
                : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="gestiondeuda/:id"
            element={
              rolFuncionalidades.GESTION_DEUDA
                ? <GestionDeudas />
                : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="gestiondeuda/:id/editar/:entidad/convenio/:convenioid/cuit/:cuit"
            element={
              rolFuncionalidades.GESTION_DEUDA
                ? <GestionDeudas />
                : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="convenio/:id/cuotas"
            element={
              rolFuncionalidades.GESTION_DEUDA
                ? <Cuotas />
                : <Navigate to="/dashboard/inicio" replace />
            }
          />
          <Route
            path="convenios"
            element={
              rolFuncionalidades.CONVENIO_CONSULTA
                ? <Convenios />
                : <Navigate to="/dashboard/inicio" replace />
            }
          />
        </Route>
        <Route path="registercompany" element={<RegistroEmpresa />} />
        <Route index element={<Navigate to="/login" />} />
        
      </Routes>
    
  );
};

export default AppRouter;
