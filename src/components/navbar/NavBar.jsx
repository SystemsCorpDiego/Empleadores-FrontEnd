import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ButtonOutlinedComponent } from '../ButtonOutlinedComponent';
// importar una imagen de assets
import logo from '../../assets/logo_2.svg';
import {
  AMTIMA_AZUL_PNG,
  UOMA_AZUL_PNG,
  OSPIM_AZUL_PNG,
} from '../../assets/imagesBase64';
import AMTIMA from '../../assets/Logos_PNG_azul/AMTIMA_AZUL.png';
import OSPIM from '../../assets/Logos_PNG_azul/OSPIM_AZUL.png';
import UOMA from '../../assets/Logos_PNG_azul/UOMA_AZUL.png';
import Hidden from '@mui/material/Hidden';

import './NavBar.css';

const NavBar = ({ estilos, estilosLogo, mostrarBtn }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (state) localStorage.setItem('stateLogin', JSON.stringify(state));

  const login = () => {
    navigate('/login');
  };

  return (
    <div style={estilos}>
      <header>
        <div>
          <Hidden smDown>
            <h1>Portal empleadores de UOMA</h1>
          </Hidden>
        </div>
        {mostrarBtn ? (
          <ButtonOutlinedComponent name={'Iniciar Sesión'} onClick={login} />
        ) : (
          <div className="entidadesL">
            <img
              style={estilosLogo}
              src={`data:image/png;base64,${UOMA_AZUL_PNG}`}
              alt="imglogo"
            />
            <img
              style={estilosLogo}
              src={`data:image/png;base64,${OSPIM_AZUL_PNG}`}
              alt="imglogo"
            />
            <img
              style={estilosLogo}
              src={`data:image/png;base64,${AMTIMA_AZUL_PNG}`}
              alt="imglogo"
            />
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
};

export default NavBar;
