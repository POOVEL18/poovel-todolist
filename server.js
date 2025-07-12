const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Define Todo Schema and Model
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Get all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const todo = new Todo({ text });
  await todo.save();
  res.status(201).json(todo);
});

// Toggle todo completion
app.put('/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Delete completed todos
app.delete('/todos/completed', async (req, res) => {
  const result = await Todo.deleteMany({ completed: true });
  res.json({ deletedCount: result.deletedCount });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
