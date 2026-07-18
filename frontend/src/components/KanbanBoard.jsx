import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = ({ tasks, onTasksChange, onUpdateTask, onDeleteTask }) => {
  const [boardTasks, setBoardTasks] = useState(tasks);

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = boardTasks.find((t) => t.id === draggableId);
    
    // Create new array to avoid mutating state directly
    const newTasks = Array.from(boardTasks);
    
    // Remove from old position
    const sourceIndex = newTasks.findIndex(t => t.id === draggableId);
    newTasks.splice(sourceIndex, 1);
    
    // Update status based on destination column
    const updatedTask = { 
      ...draggedTask, 
      status: destination.droppableId
    };
    
    // Add to new position
    // We need to figure out the actual index in the full array, since destination.index 
    // is just the index within that specific column.
    // Let's filter to just the destination column tasks (excluding the one we removed)
    const destColumnTasks = newTasks.filter(t => t.status === destination.droppableId);
    
    // If inserting at the end of the column
    if (destination.index >= destColumnTasks.length) {
      newTasks.push(updatedTask);
    } else {
      // Find the task that is currently at the destination index in that column
      const taskAtDest = destColumnTasks[destination.index];
      // Find its absolute index in the main array
      const absoluteIndex = newTasks.findIndex(t => t.id === taskAtDest.id);
      newTasks.splice(absoluteIndex, 0, updatedTask);
    }

    // Update positions for backend syncing
    const reorderedTasks = newTasks.map((t, index) => ({
      ...t,
      position: index
    }));

    setBoardTasks(reorderedTasks);
    onTasksChange(reorderedTasks);
  };

  const getTasksByStatus = (status) => {
    return boardTasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  return (
    <div className="board-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map((columnId) => (
          <div key={columnId} className="column">
            <div className="glass-panel column-header">
              <span>{columnId}</span>
              <span className="badge" style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)' }}>
                {getTasksByStatus(columnId).length}
              </span>
            </div>
            
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  className={`glass-panel task-list ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {getTasksByStatus(columnId).map((task, index) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      index={index}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
