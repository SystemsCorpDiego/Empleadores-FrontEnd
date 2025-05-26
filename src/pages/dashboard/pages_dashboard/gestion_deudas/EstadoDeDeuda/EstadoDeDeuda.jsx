import './EstadoDeDeuda.css';
import { Paper, Box, Typography, Grid, Checkbox } from '@mui/material';
import formatter from '@/common/formatter';
export const EstadoDeDeuda = ({
  isCheckedEstadoDeDeduda,
  setIsCheckedEstadoDeDeduda,
  fecha_total,
  deuda,
  saldo_a_favor,
}) => {
  const handleCheckboxChange = (event) => {
    setIsCheckedEstadoDeDeduda(event.target.checked);
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', margin: 'auto' }}>
      <Typography variant="h6" color="primary">
        ESTADO DE DEUDA
      </Typography>
      <Box className="estadoCheck">
        <Checkbox checked={isCheckedEstadoDeDeduda} onChange={handleCheckboxChange} />
        <Typography variant="body1" color="primary">
          Total al día: {fecha_total}
        </Typography>
        <Grid
          container
          spacing={1}
          style={{ marginTop: '16px' }}
          flexDirection={'row-reverse'}
        >
          <Grid item xs={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="white"
              borderRadius="8px"
              border={1}
              borderColor="grey.400"
              padding="8px"
            >
              <Typography variant="h6" color="error">
                {formatter.currencyString(deuda)}
              </Typography>
            </Box>
            <Typography variant="body2" align="center" color="textSecondary">
              DEUDA
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="white"
              borderRadius="8px"
              border={1}
              borderColor="grey.400"
              padding="8px"
            >
              <Typography variant="h6" color="success">
                {formatter.currencyString(saldo_a_favor * -1)}
              </Typography>
            </Box>
            <Typography variant="body2" align="center" color="textSecondary">
              SALDO A FAVOR
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
