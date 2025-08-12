
import { axiosCrud } from '@/components/axios/axiosCrud';
const API_BASE_URL = ''; // Cambia esta URL por la de tu API
import { getRol } from '@/components/localStorage/localStorageService';
import oAxios from '@components/axios/axiosInstace';
import swal from '@/components/swal/swal';

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

const getEmpresaId = async (cuit) => {
    console.log('getEmpresaId - cuit:', cuit);
    const URL = `/empresa/?cuit=${cuit}`
    console.log(URL)
    const response = await axiosCrud.consultar(URL);
    console.log(response)
    return response[0].id;
}
const ConveniosService = {



    getAllConvenios: async (empresaId) => {
        try {
            //const response = await axiosCrud.consultar(`${API_BASE_URL}`);
            let URL = ''
            const rol = getRol();
            if (rol == 'OSPIM_EMPLEADO') {
                URL = `/convenios`
            } else {
                URL = `/empresa/${empresaId}/convenios`;
            }

            const response = await axiosCrud.consultar(`${URL}`);

            //return response.data;
            return response || [];
        } catch (error) {
            console.error('Error fetching convenios:', error);
            throw error;
        }
    },
    imprimirConvenio: async (cuit, convenioId) => {
        console.log('Imprimiendo convenio desde ConveniosApi:', cuit, convenioId);
        const empresaId = await getEmpresaId(cuit)
        const URL = `/empresa/${empresaId}/convenios/${convenioId}/imprimir`;
        console.log('Imprimiendo convenio desde ConveniosApi:', URL);

        try {
            const response = await oAxios.get(URL, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Convenio_${convenioId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            swal.showErrorBackEnd('Error de Impresion', error);
        }
    },

    getConveniosByDateAndState: async (filtro, empresaId, rol) => {
        const { fechaDesde, fechaHasta, estado } = filtro;
        console.log('empresaId = ', empresaId)
        console.log('fechaDesde:', fechaDesde);
        console.log('fechaHasta:', fechaHasta);
        console.log('fechaHasta == null:', fechaHasta == '');
        console.log('estado:', estado);
        const emp = rol === 'OSPIM_EMPLEADO' ? '' : empresaId;
        console.log('emp:', emp);
        try {
            // Construir los parámetros dinámicamente
            const params = [];
            if (fechaDesde !== '') params.push(`desde=${fechaDesde}`);
            if (fechaHasta !== '') params.push(`hasta=${fechaHasta}`);
            if (estado !== 'TODOS') params.push(`estado=${estado}`);
            if (emp !== '') params.push(`empresaId=${emp}`);

            const queryString = params.length > 0 ? `?${params.join('&')}` : '';
            const response = await axiosCrud.consultar(
                `${API_BASE_URL}convenios${queryString}`
            );
            return response || [];
        } catch (error) {
            console.error('Error fetching convenios by date and state:', error);
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

    updateConvenio: async (updatedRow) => {
        try {

            const URL = `/convenios/${updatedRow.id}/estado-set/${updatedRow.estado}`;
            //return objeto
            const response = await oAxios.post(URL, {});
            console.log('Convenio actualizado:', response);
            if (
                response.status !== 204 &&
                response.status !== 200 &&
                response.status !== 201
            ) {
                console.log(
                    `axiosCrud.actualizar() - ERROR 2 - UrlApi: ${URL} - response.status !== 204 - response: ${JSON.stringify(
                        response,
                    )} `,
                );
                swal.showErrorBackEnd(`Error al actualizar el convenio`, response.data.descripcion);
                return false;
            }

            return true;
        } catch (error) {
            console.log('axiosCrud.actualizar()', error);

            // Extrae mensaje de forma segura (AxiosError)
            const descripcion =
                error?.response?.data?.descripcion ??
                error?.response?.data?.message ??
                error?.message ??
                'Error desconocido';

            console.error('error', descripcion);
            swal.showErrorBackEnd( descripcion);
            return false;
        }
    },

    aceptarTerminosYCondiciones: async (updatedRow) => {
        console.log('Aceptando términos y condiciones para convenio:', updatedRow);

        try {
            const response = await oAxios.post(`/convenios/${updatedRow.id}/estado-set/PRES`, {});
            //const response = await oAxios.post(URL, {});
            console.log('Convenio actualizado:', response);
            if (
                response.status !== 204 &&
                response.status !== 200 &&
                response.status !== 201
            ) {
                //JsonServer devuelve 200
                console.log(
                    `axiosCrud.actualizar() - ERROR 2 - UrlApi: ${URL} - response.status !== 204 - response: ${JSON.stringify(
                        response,
                    )} `,
                );
                swal.showErrorBackEnd(response.data.descripcion, `Error al actualizar el convenio`);
                return false;
            }

            return true;
        } catch (error) {
            console.log(
                `axiosCrud.actualizar()`,
                error,
            );
            swal.showErrorBackEnd(error.response.data.descripcion ? error.response.data.descripcion : `Error en la respuesta del servidor.`,);

            return false
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
