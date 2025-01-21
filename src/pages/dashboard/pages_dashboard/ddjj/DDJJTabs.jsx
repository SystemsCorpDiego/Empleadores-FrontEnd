import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './DDJJTabs.css';

import { UserContext } from '@/context/UserContext';
import { MisDDJJFiltro } from './consultas/empresa/MisDDJJFiltro';
import { ThemeProvider } from '@mui/material/styles';

import { DDJJForm } from '@/pages/dashboard/pages_dashboard/ddjj/formulario/DDJJForm';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const DDJJTabs = () => {
  const [idDDJJ, setIdDDJJ] = useState(null);
  const [tabSelected, setTabSelected] = useState(0);
  const [tituloPrimerTab, setTituloPrimerTab] = useState(
    'Alta Declaración Jurada',
  );

  const location = useLocation();

  const { themeWithLocale } = useContext(UserContext);

  const handleChangeTabState = (event, value) => setTabSelected(value);

  const handlerDDJJEditar = (idDDJJNew) => {
    console.log('DDJJTabsPrueba - handlerDDJJEditar - idDDJJNew:', idDDJJNew);
    setIdDDJJ(idDDJJNew);
    setTabSelected(0);
    setTituloPrimerTab('Modificar Declaracion Jurada');
  };

  useEffect(() => {
    if (location.pathname.includes('alta')) {
      setTabSelected(0);
    } else if (location.pathname.includes('consulta')) {
      setTabSelected(1);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (tabSelected === 1) {
      //window.location.reload();
      setTituloPrimerTab('Alta Declaración Jurada');
      setIdDDJJ(null);
    }
  }, [tabSelected]);

  const mostrarConsultaMissDDJJ = () => {
    setTabSelected(1);
  };

  const initFormDDJJ = () => {
    setIdDDJJ(null);
  };

  return (
    <div className="declaraciones_juradas_container">
      <h1>Administración de Declaraciones Juradas</h1>
      <ThemeProvider theme={themeWithLocale}>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '50px' }}
          >
            <Tabs value={tabSelected} onChange={handleChangeTabState}>
              <Tab
                label={tituloPrimerTab}
                {...a11yProps(0)}
                sx={{ fontSize: '1.2rem' }}
              />
              <Tab
                label="Mis Declaraciones Juradas"
                {...a11yProps(1)}
                sx={{ fontSize: '1.2rem' }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabSelected} index={0}>
            <DDJJForm
              idDDJJ={idDDJJ}
              mostrarConsultaMissDDJJ={mostrarConsultaMissDDJJ}
              initFormDDJJ={initFormDDJJ}
            ></DDJJForm>
          </CustomTabPanel>
          <CustomTabPanel value={tabSelected} index={1}>
            <MisDDJJFiltro handlerDDJJEditar={handlerDDJJEditar} />
          </CustomTabPanel>
        </Box>
      </ThemeProvider>
    </div>
  );
};
