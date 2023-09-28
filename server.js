const http = require('http');
const path = require('path');
const { readFile, writeFile, deleteFile } = require('./fileoperations');

// Define API endpoints
const apiEndpoints = {
  GET_USERS: '/api/v1/users',
  POST_USERS: '/api/v1/users',
  DELETE_USERS: '/api/v1/users',
};

// Handle GET request to retrieve user data
function handleGetUsers(req, res) {
  readFile(path.join(__dirname, 'users.json'), (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  });
}

// Handle POST request to create a new user
function handlePostUsers(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const newUser = JSON.parse(body);
      writeFile(path.join(__dirname, 'users.json'), newUser, (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      });
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
}

// Handle DELETE request to delete user data
function handleDeleteUsers(req, res) {
  deleteFile(path.join(__dirname, 'users.json'), (err) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(204);
    res.end();
  });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === apiEndpoints.GET_USERS) {
    handleGetUsers(req, res);
  } else if (req.method === 'POST' && req.url === apiEndpoints.POST_USERS) {
    handlePostUsers(req, res);
  } else if (req.method === 'DELETE' && req.url === apiEndpoints.DELETE_USERS) {
    handleDeleteUsers(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});
