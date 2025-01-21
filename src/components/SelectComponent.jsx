import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const SelectComponent = (props) => {
  return (
    <Box
      sx={{
        textAlign: 'left',
        color: '#606060',
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Seleccionar ramo</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.value}
          label="Seleccionar ramo"
          onChange={props.onChange}
        >
          {props.options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
