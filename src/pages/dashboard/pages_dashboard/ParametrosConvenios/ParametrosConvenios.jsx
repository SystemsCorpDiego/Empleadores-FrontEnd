import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridActionsCellItem,
    GridRowModes,
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

export const ParametrosConvenios = () => {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const [locale] = useState('esES');
    const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [theme, locale]);
    const { paginationModel, setPaginationModel, pageSizeOptions } = useContext(UserContext);

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
            vigDesde: '',
            vigHasta: '',
        };
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [tempId]: { mode: GridRowModes.Edit },
        }));
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };

    const handleEditClick = (row) => () => {
        setRowModesModel(prev => ({
            ...prev,
            [row.id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleSaveClick = (row) => async () => {
        const isNew = String(row.id).startsWith('temp-');
        setIsLoading(true);
        try {
            const saved = isNew
                ? await axiosParametrosConvenios.crear(row)
                : await axiosParametrosConvenios.actualizar(row);

            setRows(prev => prev.map(r => (r.id === row.id ? saved : r)));

            setRowModesModel(prev => ({
                ...prev,
                [saved.id]: { mode: GridRowModes.View },
            }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelClick = (row) => () => {
        setRowModesModel(prev => ({
            ...prev,
            [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));
        if (String(row.id).startsWith('temp-')) {
            setRows(prev => prev.filter(r => r.id !== row.id));
        }
    };

    const handleDeleteClick = (row) => async () => {
        if (String(row.id).startsWith('temp-')) {
            setRows(prev => prev.filter(r => r.id !== row.id));
        } else {
            if (window.confirm('¿Confirmar eliminación?')) {
                const eliminado = await axiosParametrosConvenios.eliminar(row.id);
                if (eliminado) {
                    setRows(prev => prev.filter(r => r.id !== row.id));
                }
            }
        }
    };

    const columns = [
        { field: 'cuit', headerName: 'CUIT', flex: 1, editable: true },
        { field: 'antiguedad', headerName: 'Antigüedad (días)', type: 'number', flex: 1, editable: true },
        { field: 'cuotas', headerName: 'Cant. cuotas', type: 'number', flex: 1, editable: true },
        { field: 'diasIntencion', headerName: 'Días p/ intención pago', type: 'number', flex: 1, editable: true },
        ...['ventanilla', 'redlink', 'banelco', 'cheque'].map((field) => ({
            field,
            headerName: field.charAt(0).toUpperCase() + field.slice(1),
            type: 'boolean',
            flex: 0.5,
            editable: true,
            renderCell: params => <Checkbox checked={!!params.value} disabled />,
            renderEditCell: params => (
                <Checkbox
                    checked={!!params.value}
                    onChange={e =>
                        params.api.setEditCellValue({ id: params.id, field, value: e.target.checked })
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
            valueGetter: ({ value }) => value ? new Date(value) : null,
            renderEditCell: (params) => (
                <TextField
                    type="date"
                    value={params.value ? new Date(params.value).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        params.api.setEditCellValue({ id: params.id, field: 'vigDesde', value: e.target.value })
                    }
                />
            )
        },
        {
            field: 'vigHasta',
            headerName: 'Vigencia hasta',
            type: 'date',
            flex: 1,
            editable: true,
            valueGetter: ({ value }) => value ? new Date(value) : null,
            renderEditCell: (params) => (
                <TextField
                    type="date"
                    value={params.value ? new Date(params.value).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        params.api.setEditCellValue({ id: params.id, field: 'vigHasta', value: e.target.value })
                    }
                />
            )
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

    const CustomToolbar = () => (
        <GridToolbarContainer>
            <Button startIcon={<AddIcon />} onClick={handleAdd}>Nuevo</Button>
            <GridToolbarQuickFilter sx={{ ml: 2 }} />
        </GridToolbarContainer>
    );

    return (
        <div className='pc_container'>
            <h1 style={{ display: 'flex', alignItems: 'center' }}>Parámetros para convenios</h1>
            <ThemeProvider theme={themeWithLocale}>
                <Box sx={{ height: 600, width: '100%' }}>
                    {isLoading && <LinearProgress />}
                    <DataGrid
                        rows={rows}
                        getRowId={(row) => row.id}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={setRowModesModel}
                        processRowUpdate={(row) => row}
                        components={{ Toolbar: CustomToolbar }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={pageSizeOptions}
                    />
                </Box>
            </ThemeProvider>
        </div>
    );
};