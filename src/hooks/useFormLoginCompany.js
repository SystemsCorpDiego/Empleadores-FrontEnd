import { useState } from 'react';

export const useFormLoginCompany = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);

  const OnInputChangeLoginCompany = ({ target }) => {
    const { name, value } = target;

    // Use propagacion para copiar el estado actual y luego se agregar una nueva propiedad con el nombre del campo del formulario y su valor
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const OnResetFormLoginCompany = () => {
    setFormState(initialState);
  };

  return {
    ...formState,
    formState,
    OnInputChangeLoginCompany,
    OnResetFormLoginCompany,
  };
};
