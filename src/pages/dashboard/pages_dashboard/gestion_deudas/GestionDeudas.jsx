import React, { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import localStorageService from '@/components/localStorage/localStorageService';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import * as locales from '@mui/material/locale';
import PropTypes from 'prop-types';
import { Gestion } from './Entidades/Gestion';
import { useParams } from 'react-router-dom';

import './GestionDeudas.css';

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

export const GestionDeudas = () => {
  const { id } = useParams();
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const [tabState, setTabState] = useState(0);
  const theme = useTheme();
  const locale = 'esES';
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );
  const handleChangeTabState = (event, value) => setTabState(value);

  useEffect(() => {
    console.log(id);
  }, []);

  return (
    <div className="gestion_deudas_container">
      <div className="flex_properties">
        <h1
          style={{
            display: 'flex',
          }}
        >
          Gestión de Deuda
        </h1>
        <div className="flex_properties"></div>
        <ThemeProvider theme={themeWithLocale}>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                marginTop: '50px',
              }}
            >
              <Tabs value={tabState} onChange={handleChangeTabState}>
                <Tab
                  label="UOMA"
                  {...a11yProps(0)}
                  sx={{ fontSize: '1.2rem' }}
                />
                <Tab
                  label="OSPIM"
                  {...a11yProps(1)}
                  sx={{ fontSize: '1.2rem' }}
                />
                <Tab
                  label="AMTIMA"
                  {...a11yProps(3)}
                  sx={{ fontSize: '1.2rem' }}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={tabState} index={0}>
              <Gestion ID_EMPRESA={ID_EMPRESA} ENTIDAD={'UOMA'}></Gestion>
            </CustomTabPanel>
            <CustomTabPanel value={tabState} index={1}>
              <Gestion ID_EMPRESA={ID_EMPRESA} ENTIDAD={'OSPIM'}></Gestion>
            </CustomTabPanel>
            <CustomTabPanel value={tabState} index={2}>
              <Gestion ID_EMPRESA={ID_EMPRESA} ENTIDAD={'AMTIMA'}></Gestion>
            </CustomTabPanel>
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};
