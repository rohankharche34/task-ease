import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Search, LayoutDashboard } from 'lucide-react';
import ThemeSelector from './components/ThemeSelector';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      toast.error('Could not load tasks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const taskWithId = { ...newTask, id: crypto.randomUUID() };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithId)
      });
      if (!res.ok) throw new Error('Failed to create task');
      const createdTask = await res.json();
      setTasks([...tasks, createdTask]);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Error creating task');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const res = await fetch(`${API_URL}/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) throw new Error('Failed to update task');
      const savedTask = await res.json();
      setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const handleBatchUpdate = async (updatedTasks) => {
    // Optimistic UI update
    setTasks(updatedTasks);
    try {
      const res = await fetch(`${API_URL}/batch/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks })
      });
      if (!res.ok) throw new Error('Failed to save reorder');
    } catch (error) {
      toast.error('Error saving task order');
      fetchTasks(); // Revert on error
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      
      <header className="header glass-panel">
        <div className="header-title">
          <LayoutDashboard size={28} />
          <h1>TaskEase</h1>
        </div>
        <ThemeSelector />
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <div className="dashboard-controls glass-panel" style={{ padding: '1rem 2rem' }}>
          <div className="search-bar">
            <Search size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            New Task
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading Tasks...</div>
          </div>
        ) : (
          <KanbanBoard 
            tasks={filteredTasks} 
            onTasksChange={handleBatchUpdate}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleCreateTask} 
        />
      )}
    </div>
  );
}

export default App;
