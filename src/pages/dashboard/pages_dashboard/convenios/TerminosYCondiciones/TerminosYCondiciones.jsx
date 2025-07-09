import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ConveniosService from '@/pages/dashboard/pages_dashboard/convenios/ConveniosApi';
import Swal from 'sweetalert2';

const TerminosYCondiciones = ({open, setOpen, rowTyC, setRowTyC, fetchData}) => {
    const handleClose = () => setOpen(false);

    const handleAceptar =async () => {
        
        console.log(rowTyC)
        const response = await ConveniosService.aceptarTerminosYCondiciones(rowTyC)
        console.log('Términos y condiciones aceptados:', response);
        handleClose();
        setRowTyC(null); // Limpiar el estado de la fila después de aceptar
        fetchData()
    }
    React.useEffect(() => {
        if (open) {
            Swal.fire({
                title: 'Términos y Condiciones',
                html: `
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                `,
                showCancelButton: true,
                confirmButtonText: 'Aceptar Términos y Condiciones',
                confirmButtonColor: '#1a76d2',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    popup: 'swal2-modal-tyc',
                    
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await handleAceptar();
                }
                handleClose();
            });
        }
    }, [open]);

}
export default TerminosYCondiciones;
