import localStorageService from '@components/localStorage/localStorageService';
import { DatosPersona } from '@pages/dashboard/pages_dashboard/datosPerfil/DatosPersona';
import { DatosEmpresa } from '@pages/dashboard/pages_dashboard/datos_empresa/DatosEmpresa';

export const DatosPerfil = () => {
  const bRolEmpleador = localStorageService.isRolEmpleador();

  return (
    <div>
      {bRolEmpleador && <DatosEmpresa />}
      {!bRolEmpleador && <DatosPersona />}
    </div>
  );
};
