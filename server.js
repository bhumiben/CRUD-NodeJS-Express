const http = require('http');
const fs = require('fs');
const path = require('path');

// Importing file operation functions from fileOperations.js
const { readFile, writeFile, deleteFile } = require('./fileoperations');

// Creating an HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/v1/users') {
    // Read user data from a file using fs and path modules
    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/api/v1/users') {
    // Handleing and creating a new user 
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      // Parseing the JSON data
      try {
        const newUser = JSON.parse(body);

        // Write the new user data to the JSON file
        writeFile(path.join(__dirname, 'users.json'), newUser);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  } else if (req.method === 'DELETE' && req.url === '/api/v1/users') {
    // Handling deleting the user data file
    deleteFile(path.join(__dirname, 'users.json'));

    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Starting the server on port 3000
server.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});
