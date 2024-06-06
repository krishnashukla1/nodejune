const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const DATA_FILE = './data.json';

// Utility function to read data from the JSON file
const readData = () => {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// Utility function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Create (POST)
app.post('/items', (req, res) => {
  const data = readData();
  const newItem = req.body;
  newItem.id = Date.now();
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Read (GET)
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data);
});

app.get('/items/:id', (req, res) => {
  const data = readData();
  const item = data.find(i => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Update (PUT)
app.put('/items/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex(i => i.id === parseInt(req.params.id));
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete (DELETE)
app.delete('/items/:id', (req, res) => {
  let data = readData();
  const newData = data.filter(i => i.id !== parseInt(req.params.id));
  if (newData.length !== data.length) {
    writeData(newData);
    res.json({ message: 'Item deleted' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



/*
POST----  http://localhost:3000/items

{
    "name": "Krishna Shukla",
    "description": "This is a sample name"
}

-----
GET--- http://localhost:3000/items/1717674254558
GET BY ID---http://localhost:3000/items/1717674254558
----
PUT---http://localhost:3000/items/1717674254558
{
    "name": "Mr Krishna Shukla",
    "description": "This is a sample name"
}
-----
DELETE---http://localhost:3000/items/1717674254558


*/