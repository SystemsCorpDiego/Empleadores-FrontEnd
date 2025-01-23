import swal from '@/components/swal/swal';

const RECUPERO_MSG = import.meta.env.VITE_RECUPERO_MSG;

export const recuperoContrasena = async (email) => {
  swal.showSuccess(RECUPERO_MSG);
};
