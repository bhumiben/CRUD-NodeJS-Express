const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Create an Express application
const app = express();
const port = 3000;

// MongoDB connection 
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'miniproject7';

app.use(bodyParser.json());

app.get('/api/users', async (req, res) => {
try {
const data = await readUserData();
sendJSONResponse(res, 200, data);
} catch (error) {
sendResponse(res, 500, 'text/plain', 'Internal Server Error');
}
});

// Define route for creating a new user
app.post('/api/users', async (req, res) => {
const newUser = req.body;
try {
const data = await readUserData();
data.push(newUser);
await writeUserData(data);
sendResponse(res, 201, 'text/plain', 'User created successfully');
} catch (error) {
sendResponse(res, 400, 'text/plain', 'Invalid JSON format');
}
});


// Define route for updating a user
app.put('/api/users/:userId', async (req, res) => {
const userId = req.params.userId;
const updatedUser = req.body;
try {
const data = await readUserData();
const userIndex = data.findIndex((user) => user.id === userId);
if (userIndex === -1) {
sendResponse(res, 404, 'text/plain', 'User not found');
} else {
data[userIndex] = { ...data[userIndex], ...updatedUser };
await writeUserData(data);
sendResponse(res, 200, 'text/plain', 'User updated successfully');
}
} catch (error) {
sendResponse(res, 400, 'text/plain', 'Invalid JSON format');
}
});

// Define route for deleting a user
app.delete('/api/users/:userId', async (req, res) => {
const userId = req.params.userId;
try {
const data = await readUserData();
const userIndex = data.findIndex((user) => user.id === userId);
if (userIndex === -1) {
sendResponse(res, 404, 'text/plain', 'User not found');
} else {
data.splice(userIndex, 1);
await writeUserData(data);
sendResponse(res, 200, 'text/plain', 'User deleted successfully');
}
} catch (error) {
sendResponse(res, 500, 'text/plain', 'Internal Server Error');
}
});


// Function to read user data from the MongoDB database
async function readUserData() {
const client = new MongoClient(mongoUrl);
try {
await client.connect();
const db = client.db(dbName);
const usersCollection = db.collection('users');
const userData = await usersCollection.find({}).toArray();
return userData;
} catch (error) {
throw error;
} finally {
client.close();
}
}

// Function to write user data to the MongoDB database
async function writeUserData(userData) {
const client = new MongoClient(mongoUrl);
try {
await client.connect();
const db = client.db(dbName);
const usersCollection = db.collection('users');
await usersCollection.deleteMany({});
await usersCollection.insertMany(userData);
} catch (error) {
throw error;
} finally {
client.close();
}
}

function sendResponse(res, status, contentType, data) {
res.writeHead(status, { 'Content-Type': contentType });
res.end(data);
}

function sendJSONResponse(res, status, data) {
sendResponse(res, status, 'application/json', JSON.stringify(data));
}

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}/`);
});