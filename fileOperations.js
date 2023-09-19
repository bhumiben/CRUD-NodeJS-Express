const fs = require('fs');

// Function to handle file read operations
function readFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        console.log('File content:', data);
    });
}

// Function to handle file write operations
function writeFile(filePath, data) {
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Error writing the file:', err);
            return;
        }
        console.log('The file has been saved!', data);
    });
}

// Function to handle file deletion
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting a file', err);
            return;
        }
        console.log(`${filePath} was deleted`);
    });
}

// Example usage:
const filePath = 'week1.txt';
const data = 'bhumi';

// Read the file
readFile(filePath);

// Write data to the file
writeFile(filePath, data);

// Delete the file
deleteFile(filePath);
