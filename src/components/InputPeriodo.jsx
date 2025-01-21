import { useRef, useLayoutEffect } from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import formatter from '@/common/formatter';

export const InputPeriodo = (props) => {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = useRef();
  const handleValue = (event) => {
    const newValue = event.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  useLayoutEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  return (
    <input
      ref={ref}
      type="month"
      className="MuiInputBase-input css-yz9k0d-MuiInputBase-input"
      defaultValue={formatter.periodoISOString(value)}
      onChange={handleValue}
    />
  );
};
