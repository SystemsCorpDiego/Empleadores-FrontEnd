import Button from '@mui/material/Button';

export const ButtonOutlinedComponent = ({ styles, name, onClick }) => {
  return (
    <Button
      variant="contained"
      sx={{
        ...styles,
        backgroundColor: 'bg_primary.btn_nav',
        color: 'color_primary.btn_nav',
        '&:hover': {
          backgroundColor: 'bg_btn_nav.main',
          color: '#fff',
        },
      }}
      type="submit"
      onClick={onClick}
    >
      {name}
    </Button>
  );
};
