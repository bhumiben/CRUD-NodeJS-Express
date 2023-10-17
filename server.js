const express = require('express');
const fs = require('fs').promises; // Using fs.promises for Promise-based file operations
const path = require('path');
const { readFile, writeFile, deleteFile } = require('./fileoperations'); // Assuming fileoperations.js contains promise-based file operations

const app = express();
var cors = require('cors')

const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors())

// Define the path to the user data file
const userDataFilePath = path.join(__dirname, 'users.json');

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();

});

// Define routes and handlers using Async/Await and Promises
app.get('/', cors(), async (req, res) => {
  res.json({msg: 'This is CORS-enabled for all origins!'})
  
});


  app.get('/api/v1/users', cors(), async (req, res) => {
    try {
      const data = await fs.readFile(userDataFilePath, 'utf8');
      console.log(data); // Logging the data
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      console.error('Error reading or parsing JSON file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
app.post('/api/v1/users', cors(), async (req, res) => {


  const newUser = req.body;
  try {
    await writeFile(userDataFilePath, JSON.stringify(newUser));
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/v1/users', cors(), async (req, res) => {


  try {
    await deleteFile(userDataFilePath);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle unsupported routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
