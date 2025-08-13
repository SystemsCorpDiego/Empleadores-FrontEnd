// ParametrosConvenios.jsx
import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridActionsCellItem,
    GridRowModes,
    useGridApiRef
} from '@mui/x-data-grid';
import { Button, Checkbox, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import { UserContext } from '@/context/userContext';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import './ParametrosConvenios.css';
import { axiosParametrosConvenios } from './ParametrosConveniosApi';
import StripedDataGrid from '@/common/dataGridStyle';
import EditarNuevaFilaParametros from './EditarNuevaFilaParametros';

export const ParametrosConvenios = () => {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const [locale] = useState('esES');
    const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [theme, locale]);
    const { paginationModel, setPaginationModel, pageSizeOptions } = useContext(UserContext);
    const gridApiRef = useGridApiRef();
    // ----------- Data fetch -----------
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await axiosParametrosConvenios.consultar();
                setRows(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ----------- Handlers -----------
    /*
    const handleAdd = () => {
        const tempId = `temp-${Date.now()}`;
        const newRow = {
            id: tempId,
            isNew: true,
            cuit: '',
            antiguedad: 0,
            cuotas: 0,
            diasIntencion: 0,
            ventanilla: false,
            redlink: false,
            banelco: false,
            cheque: false,
            tasa: '',
            vigDesde: null,
            vigHasta: null,
        };
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [tempId]: { mode: GridRowModes.Edit },
        }));
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };
    */
    const handleEditClick = (row) => () => {
        setRowModesModel(prev => ({
            ...prev,
            [row.id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleSaveClick = (row) => () => {
        setRowModesModel(prev => ({
            ...prev,
            [row.id]: { mode: GridRowModes.View },
        }));
    };

    const handleCancelClick = (row) => () => {
        setRowModesModel(prev => ({
            ...prev,
            [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));
        // si es nuevo temporal, lo saco
        if (String(row.id).startsWith('temp-')) {
            setRows(prev => prev.filter(r => r.id !== row.id));
        }
    };

    const handleDeleteClick = (row) => async () => {
        if (String(row.id).startsWith('temp-')) {
            setRows(prev => prev.filter(r => r.id !== row.id));
            return;
        }
        if (window.confirm('¿Confirmar eliminación?')) {
            const ok = await axiosParametrosConvenios.eliminar(row.id);
            if (ok) setRows(prev => prev.filter(r => r.id !== row.id));
        }
    };

    // ----------- processRowUpdate (crear/actualizar) -----------

    const processRowUpdate = useCallback(
        async (newRow, oldRow) => {
            // newRow trae las ediciones realizadas en modo row
            if (String(newRow.id).startsWith('temp-')) {
                // CREAR
                const creado = await axiosParametrosConvenios.crear(newRow);
                if (creado && creado.id) {
                    setRows(prev => {
                        const withoutTemp = prev.filter(r => r.id !== newRow.id);
                        return [creado, ...withoutTemp];
                    });
                    return creado;
                }
                // si falla, devolvemos el viejo para revertir
                return oldRow;
            } else {
                // ACTUALIZAR
                const ok = await axiosParametrosConvenios.actualizar(newRow);
                if (ok) {
                    setRows(prev => prev.map(r => (r.id === newRow.id ? newRow : r)));
                    return newRow;
                }
                return oldRow;
            }
        },
        []
    );

    // ----------- Columns -----------
    const columns = [
        { field: 'cuit', headerName: 'CUIT', flex: 1, editable: true },
        { field: 'antiguedad', headerName: 'Antigüedad (días)', type: 'number', flex: 1, editable: true },
        { field: 'cuotas', headerName: 'Cant. cuotas', type: 'number', flex: 1, editable: true },
        { field: 'diasIntencion', headerName: 'Días p/ intención pago', type: 'number', flex: 1, editable: true },

        ...['ventanilla', 'redlink', 'banelco', 'cheque'].map((field) => ({
            field,
            headerName: field.charAt(0).toUpperCase() + field.slice(1),
            type: 'boolean',
            flex: 0.6,
            editable: true,
            renderCell: (params) => <Checkbox checked={!!params.value} disabled />,
            renderEditCell: (params) => (
                <Checkbox
                    checked={!!params.value}
                    onChange={(e) =>
                        params.api.setEditCellValue({
                            id: params.id,
                            field,
                            value: e.target.checked,
                        })
                    }
                />
            ),
        })),

        { field: 'tasa', headerName: 'Tasa', flex: 1, editable: true },

        {
            field: 'vigDesde',
            headerName: 'Vigencia desde',
            type: 'date',
            flex: 1,
            editable: true,
            // Usamos Date en rows (ver normalizeIn); el editor usa yyyy-MM-dd
            renderEditCell: (params) => {
                const value = params.value instanceof Date
                    ? params.value.toISOString().slice(0, 10)
                    : (params.value ? String(params.value).slice(0, 10) : '');
                return (
                    <TextField
                        type="date"
                        value={value}
                        onChange={(e) => {
                            const v = e.target.value;
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'vigDesde',
                                value: v ? new Date(v) : null,
                            });
                        }}
                    />
                );
            },
            valueFormatter: ({ value }) => (value instanceof Date ? value.toLocaleDateString() : ''),
        },

        {
            field: 'vigHasta',
            headerName: 'Vigencia hasta',
            type: 'date',
            flex: 1,
            editable: true,
            renderEditCell: (params) => {
                const value = params.value instanceof Date
                    ? params.value.toISOString().slice(0, 10)
                    : (params.value ? String(params.value).slice(0, 10) : '');
                return (
                    <TextField
                        type="date"
                        value={value}
                        onChange={(e) => {
                            const v = e.target.value;
                            params.api.setEditCellValue({
                                id: params.id,
                                field: 'vigHasta',
                                value: v ? new Date(v) : null,
                            });
                        }}
                    />
                );
            },
            valueFormatter: ({ value }) => (value instanceof Date ? value.toLocaleDateString() : ''),
        },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 150,
            getActions: ({ row }) => {
                const isEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;
                return isEditMode
                    ? [
                        <GridActionsCellItem icon={<SaveIcon />} label="Guardar" onClick={handleSaveClick(row)} />,
                        <GridActionsCellItem icon={<CancelIcon />} label="Cancelar" onClick={handleCancelClick(row)} />,
                    ]
                    : [
                        <GridActionsCellItem icon={<EditIcon />} label="Editar" onClick={handleEditClick(row)} />,
                        <GridActionsCellItem icon={<DeleteIcon />} label="Eliminar" onClick={handleDeleteClick(row)} />,
                    ];
            },
        },
    ];



    const volverPrimerPagina = () => {
        setPaginationModel((prevPaginationModel) => ({
            ...prevPaginationModel,
            page: 0,
        }));
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };



    return (
        <div className="pc_container">
            <h1 style={{ display: 'flex', alignItems: 'center' }}>Parámetros para convenios</h1>
            <ThemeProvider theme={themeWithLocale}>
                <Box sx={{
                    height: 600, width: '100%',
                    '& .actions': {
                        color: 'text.secondary',
                    },
                    '& .textPrimary': {
                        color: 'text.primary',
                    },
                }}>
                    {isLoading && <LinearProgress />}
                    <StripedDataGrid
                        apiRef={gridApiRef}
                        rows={rows}
                        getRowId={(row) => row.id}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={setRowModesModel}
                        onRowEditStop={handleRowEditStop}

                        processRowUpdate={processRowUpdate}

                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={pageSizeOptions}
                        slots={{
                            toolbar: EditarNuevaFilaParametros,
                        }}
                        slotProps={{
                            toolbar: {
                                setRows,
                                rows,
                                setRowModesModel,
                                volverPrimerPagina,
                                showQuickFilter: true,
                                showColumnMenu: true,
                                themeWithLocale,
                                gridApiRef
                            },
                        }}
                        sx={{
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                                width: '8px',
                                visibility: 'visible',
                            },
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ccc',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#1A76D2 !important',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                color: '#fff', // Texto blanco
                                
                            },
                            '& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-sortIcon': {
                                color: '#fff', // Iconos blancos
                            },
                        }}
                    />
                </Box>
            </ThemeProvider>
        </div>
    );
};