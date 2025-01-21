import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { axiosGestionRoles } from './GestionRolesApi';
import './GestionRoles.css';

export const DragAndDrop = ({ tareas }) => {
  console.log('DragAndDrop - tareas:', tareas);

  const funcionalidades_t = [
    {
      id: 1,
      descripcion: 'FERIADO',
      activo: true,
    },
    {
      id: 2,
      descripcion: 'AJUSTES',
      activo: true,
    },
    {
      id: 3,
      descripcion: 'ROLES',
      activo: true,
    },
    {
      id: 4,
      descripcion: 'INTERESES',
      activo: true,
    },
  ];
  const [id, setRolId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [funcionalidades, setTasks] = useState(tareas || funcionalidades_t);

  useEffect(() => {
    console.log('DragAndDrop - tareas:', tareas);
    if (tareas) {
      setTasks(tareas.funcionalidades || funcionalidades_t);
      setRolId(tareas.id);
      setDescripcion(tareas.descripcion);
    }
  }, [tareas]);

  const getList = (list) => {
    if (funcionalidades) {
      return funcionalidades.filter((item) => item.activo === list);
    } else return [];
  };

  const startDrag = (evt, item) => {
    evt.dataTransfer.setData('itemID', item.id);
    console.log(item);
  };

  const draggingOver = (evt) => {
    evt.preventDefault();
  };

  const onDrop = (evt, list) => {
    const itemID = evt.dataTransfer.getData('itemID');
    const item = funcionalidades.find((item) => item.id == itemID);
    item.activo = list;

    const newState = funcionalidades.map((funcionalidad) => {
      if (funcionalidad.id === itemID) return item;
      return funcionalidad;
    });

    setTasks(newState);
  };

  const handleClick = () => {
    const rta = axiosGestionRoles.putFuncionalidades({
      id,
      descripcion,
      funcionalidades,
    });
    console.log('handleClick - rta:', rta);
  };

  return (
    <>
      <div className="drag-and-drop">
        <div className="column column--1">
          <h3>Activas</h3>
          <div
            className="dd-zone"
            droppable="true"
            onDragOver={(evt) => draggingOver(evt)}
            onDrop={(evt) => onDrop(evt, true)}
          >
            {getList(true).map((item) => (
              <div
                className="dd-element"
                key={item.id}
                draggable
                onDragStart={(evt) => startDrag(evt, item)}
              >
                <strong className="title">{item.descripcion}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="column column--2">
          <h3>Inactivas</h3>
          <div
            className="dd-zone"
            droppable="true"
            onDragOver={(evt) => draggingOver(evt)}
            onDrop={(evt) => onDrop(evt, false)}
          >
            {getList(false).map((item) => (
              <div
                className="dd-element"
                key={item.id}
                draggable
                onDragStart={(evt) => startDrag(evt, item)}
              >
                <strong className="title">{item.descripcion}</strong>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="contained"
          className="button_act"
          onClick={handleClick}
        >
          Actualizar
        </Button>
      </div>
    </>
  );
};
