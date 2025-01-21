import { useState } from 'react';

export const useFormLoginInternalUser = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);

  const OnInputChangeLoginInternalUser = ({ target }) => {
    const { name, value } = target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const OnResetFormLoginInternalUser = () => {
    setFormState(initialState);
  };

  return {
    ...formState,
    formState,
    OnInputChangeLoginInternalUser,
    OnResetFormLoginInternalUser,
  };
};
