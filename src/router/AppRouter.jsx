import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router';
import PrivateRoute from './PrivateRoute';
import { Inicio } from '../pages/dashboard/pages_dashboard/inicio/Inicio';
import NavBar from '../components/navbar/NavBar';
import { DatosEmpresa } from '../pages/dashboard/pages_dashboard/datos_empresa/DatosEmpresa';
import { DatosPerfil } from '@/pages/dashboard/pages_dashboard/datosPerfil/DatosPerfil';
import { Publicaciones } from '../pages/dashboard/pages_dashboard/publicaciones/Publicaciones';
import { RecuperoPage } from '../pages/recupero/RecuperoPage';
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
import {GestionDeudas} from '@/pages/dashboard/pages_dashboard/gestion_deudas/GestionDeudas'
import {Convenios} from '@/pages/dashboard/pages_dashboard/convenios/Convenios'


const PagosPage = () => (
  <div className="otros_pagos_container">Contenido de la página de pagos</div>
);

const AppRouter = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="recupero" element={<RecuperoPage />} />
        <Route
          path="usuario/empresa/activar/:token"
          element={<UsuaEmpreActivacion />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route path="inicio" index element={<Inicio />} />
          <Route path="publicaciones" element={<Publicaciones />} />
          <Route path="feriados" element={<Feriados />} />
          <Route path="ddjj" element={<DDJJTabs />} />
          <Route path="ddjj/alta" element={<DDJJTabs />} />
          <Route path="ddjj/consulta" element={<DDJJTabs />} />
          <Route path="ddjjconsultaempleado" element={<DDJJFiltro />} />
          <Route
            path="boletas/empleado/consulta"
            element={<BoletaEmpleadoFiltro />}
          />
          <Route path="boletas" element={<Boletas />} />
          <Route path="boletas/periodos" element={<Boletas />} />
          <Route path="boletas/Actas" element={<Boletas />} />
          <Route path="boletas/nueva" element={<Boletas />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="misdatos" element={<DatosPerfil />} />
          <Route path="datos/usuario" element={<DatosPerfil />} />

          <Route path="empresas" element={<DatosEmpresa />} />

          <Route path="usuariointerno" element={<UsuarioInterno />} />
          <Route path="cuitsrestringidos" element={<CuitsRestringidos />} />
          <Route path="roles" element={<Roles />} />
          <Route path="generarboletas/:id" element={<GenerarBoletas />} />
          <Route
            path="detalleboleta/:numero_boleta"
            element={<DetalleBoleta />}
          />
          <Route path="generarotrospagos" element={<GenerarOtrosPagos />} />
          <Route
            path="detalleotrospagos"
            errorElement={<DetalleOtrosPagos />}
          />
          <Route path="interesesafip" element={<InteresesAfip />} />
          <Route path="ajustes" element={<Ajustes />} />
          <Route path="gestion-roles" element={<GestionRoles />} />
          <Route path="aportes" element={<Aportes />} />
          <Route path="gestiondeuda" element={<GestionDeudas />} />
          <Route path="convenios" element={<Convenios />} />
          
        </Route>
        <Route path="registercompany" element={<RegistroEmpresa />} />
        <Route index element={<Navigate to="/login" />} />
        {/* </Route> */}
      </Routes>
    </UserProvider>
  );
};

export default AppRouter;
