require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY position ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { id, title, description, status, priority, dueDate, position } = req.body;
  db.run(
    'INSERT INTO tasks (id, title, description, status, priority, dueDate, position) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, title, description, status, priority, dueDate, position],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, title, description, status, priority, dueDate, position });
    }
  );
});

// Update a task (e.g. status change, position change)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate, position } = req.body;
  
  db.run(
    'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, position = ? WHERE id = ?',
    [title, description, status, priority, dueDate, position, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, title, description, status, priority, dueDate, position });
    }
  );
});

// Batch update tasks (useful for drag-and-drop reordering)
app.put('/api/tasks/batch/update', (req, res) => {
  const { tasks } = req.body;
  
  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Tasks must be an array' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    const stmt = db.prepare('UPDATE tasks SET status = ?, position = ? WHERE id = ?');
    
    tasks.forEach((task) => {
      stmt.run([task.status, task.position, task.id]);
    });
    
    stmt.finalize();
    db.run('COMMIT', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Batch update successful' });
    });
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted', id });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
