import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { generalTheme } from './generalTheme';

export const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={generalTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
