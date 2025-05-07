import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TerminosYCondiciones = ({open, setOpen}) => {
    const handleClose = () => setOpen(false);
    
    return (
            <Modal show={open} onClose={handleClose} >

                <Modal.Header closeButton>
                    <h2>Términos y Condiciones</h2>
                </Modal.Header>
                <Modal.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => {
                        alert('Términos y condiciones aceptados');
                        handleClose();
                    }}>
                        Aceptar Términos y Condiciones
                    </Button>
                </Modal.Footer>
            </Modal>          
    );

};

export default TerminosYCondiciones;
