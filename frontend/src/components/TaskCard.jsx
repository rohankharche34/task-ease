import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, Edit2, Trash2 } from 'lucide-react';
import TaskModal from './TaskModal';

const TaskCard = ({ task, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const priorityClass = `badge-${task.priority.toLowerCase()}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            className="glass-card task-card-content"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.8 : 1,
              transform: snapshot.isDragging 
                ? `${provided.draggableProps.style.transform} scale(1.02)` 
                : provided.draggableProps.style.transform,
              zIndex: snapshot.isDragging ? 100 : 'auto',
            }}
          >
            <div className="task-header">
              <span className={`badge ${priorityClass}`}>{task.priority}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="btn-icon" style={{ width: '28px', height: '28px', background: 'transparent' }} onClick={() => setIsEditing(true)}>
                  <Edit2 size={14} />
                </button>
                <button className="btn-icon" style={{ width: '28px', height: '28px', background: 'transparent', color: '#ef4444' }} onClick={() => onDelete(task.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
            </div>

            {task.dueDate && (
              <div className="task-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Draggable>

      {isEditing && (
        <TaskModal
          initialTask={task}
          onClose={() => setIsEditing(false)}
          onSave={(updatedTask) => {
            onUpdate(updatedTask);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
};

export default TaskCard;
