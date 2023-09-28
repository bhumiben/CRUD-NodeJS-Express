const fs = require('fs');

// Function to handle file read operations
function readFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return callback(err, null);
    }
    callback(null, data);
  });
}

// Function to handle file write operations
function writeFile(filePath, data, callback) {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return callback(err);
    }
    console.log('The file has been saved!', data);
    callback(null);
  });
}

// Function to handle file deletion
function deleteFile(filePath, callback) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting a file', err);
      return callback(err);
    }
    console.log(`${filePath} was deleted`);
    callback(null);
  });
}

module.exports = {
  readFile,
  writeFile,
  deleteFile,
};

