const express = require('express');
const fs = require('fs');
const path = require('path');
const { readFile, writeFile, deleteFile } = require('./fileoperations');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the path to the user data file
const userDataFilePath = path.join(__dirname, 'users.json');

// Endpoint to retrieve user data (GET)
app.get('/api/v1/users', (req, res) => {
  readFile(userDataFilePath, (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

// Endpoint to create a new user (POST)
app.post('/api/v1/users', (req, res) => {
  const newUser = req.body;

  writeFile(userDataFilePath, JSON.stringify(newUser), (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).json(newUser);
    }
  });
});

// Endpoint to delete user data (DELETE)
app.delete('/api/v1/users', (req, res) => {
  deleteFile(userDataFilePath, (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(204).end();
    }
  });
});

// Handle unsupported routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
