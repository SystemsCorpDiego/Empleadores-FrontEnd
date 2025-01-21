import { useState } from 'react';

export const useFormRegisterCompany = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);

  const OnInputChangeRegisterCompany = ({ target }) => {
    const { name, value } = target;
    let valueNew = value;
    if (name == 'razonSocial') {
      try {
        valueNew = value.toUpperCase();
      } catch (error) {
        console.log('OnInputChangeRegisterCompany - error:', error);
      }
    }
    setFormState({
      ...formState,
      [name]: valueNew,
    });
  };

  const OnResetFormRegisterCompany = () => {
    setFormState(initialState);
  };

  return {
    ...formState,
    formState,
    OnInputChangeRegisterCompany,
    OnResetFormRegisterCompany,
  };
};
