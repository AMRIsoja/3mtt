const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let items = [
  { id: 1, name: 'Item One', description: 'This is item one' },
  { id: 2, name: 'Item Two', description: 'This is item two' }
];

// Root Route
app.get('/', (req, res) => {
  res.send('Hello, World');
});

// GET all items
app.get('/items', (req, res) => {
  res.json(items);
});

// GET item by id
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1,
    name,
    description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item by id
app.put('/items/:id', (req, res) => {
  const { name, description } = req.body;
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  item.name = name;
  item.description = description;
  res.json(item);
});

// DELETE item by id
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  const deletedItem = items.splice(index, 1);
  res.json(deletedItem[0]);
});

// 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
