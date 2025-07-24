import { useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { UserContext } from './userContext';
import { useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

export const UserProvider = ({ children }) => {
  //const [sesionToken, setSesionToken] = useState(null);
  const pageSizeOptions = [50, 75, 100];
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });
  const localSet = 'esES';
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[localSet]),
    [localSet, theme],
  );
  const [sessionVersion, setSessionVersion] = useState(0);

  const triggerSessionRefresh = () => {
    setSessionVersion(prev => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        paginationModel,
        setPaginationModel,
        pageSizeOptions,
        localSet,
        themeWithLocale,
        sessionVersion,
        triggerSessionRefresh
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
