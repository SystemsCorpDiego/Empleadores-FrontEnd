import Button from '@mui/material/Button';

export const ButtonComponent = ({ styles, name }) => {
  return (
    <Button
      variant="contained"
      sx={{
        ...styles,
        /* backgroundColor:'bg_primary.main' */
      }}
      type="submit"
    >
      {name}
    </Button>
  );
};
