
import { axiosCrud } from '@/components/axios/axiosCrud';
const API_BASE_URL = 'https://api.example.com/convenios'; // Cambia esta URL por la de tu API

const conveniosData = [
    {
      id: 1,
      cuit: '20-12345678-9',
      razonSocial: 'Razos Social',
      fecha: 'MM/AAAA',
      numero: 1,
      deuda: 20000.0,
      interes: 100.0,
      saldo: 200.0,
      total: 20100.0,
      cantCuotas: 3,
      medioPago: 'Cheque',
      //cheques: '',
      estado: 'Pendiente...',
    },
    {
      id: 2,
      cuit: '20-12345678-9',
      razonSocial: 'Razos Social',
      fecha: 'MM/AAAA',
      numero: 2,
      deuda: 30000.0,
      interes: 3000.0,
      saldo: 33000.0,
      total: 33000.0,
      cantCuotas: 2,
      medioPago: 'Cheque',
      //cheques: [{ id: 1, numero: '123', monto: 5000.0, cuota: 2 }],
      estado: 'Cheque Recibido',
    },
    {
      id: 3,
      cuit: '20-12345678-9',
      razonSocial: 'Razos Social',
      fecha: 'MM/AAAA',
      numero: 3,
      deuda: 120000.0,
      interes: 20000.0,
      saldo: 140000.0,
      total: 140000.0,
      cantCuotas: 1,
      medioPago: 'Cheque',
      cheques: '',
      estado: 'Cerrado',
    },
  ];
  

const ConveniosService = {
    getAllConvenios: async () => {
        try {
            //const response = await axiosCrud.consultar(`${API_BASE_URL}`);
            const response = conveniosData
            //return response.data;
            return response || [];
        } catch (error) {
            console.error('Error fetching convenios:', error);
            throw error;
        }
    },

    getConvenioById: async (id) => {
        try {
            const response = await axiosCrud.consultar(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching convenio with ID ${id}:`, error);
            throw error;
        }
    },

    createConvenio: async (convenioData) => {
        try {
            const response = await axiosCrud.crear(`${API_BASE_URL}`, convenioData);
            return response.data;
        } catch (error) {
            console.error('Error creating convenio:', error);
            throw error;
        }
    },

    updateConvenio: async (id, estado) => {
        try {
            const objeto ={
                estado: estado
            }

            return objeto
            //const response = await axiosCrud.actualizar(`${API_BASE_URL}/${id}`, objeto);
            //return response.data;
        } catch (error) {
            console.error(`Error updating convenio with ID ${id}:`, error);
            throw error;
        }
    },

    deleteConvenio: async (id) => {
        try {
            const response = await axiosCrud.eliminar(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting convenio with ID ${id}:`, error);
            throw error;
        }
    },
};

export default ConveniosService;
