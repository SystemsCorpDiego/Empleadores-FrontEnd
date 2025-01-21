import * as React from 'react';
import TextField from '@mui/material/TextField';

export const InputComponent = (props) => {
  const { type, name, value, onChange, autocomplete, variant, label, style } =
    props;

  return (
    <TextField
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete={autocomplete}
      //variant={variant}
      /* variant={variant} */
      label={label}
      sx={{
        ...style,
      }}
    />
  );
};
