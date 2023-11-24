import fs from 'fs';


function readFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      console.error('Error reading the file:', error);
      return callback(error, null);
    }
    callback(null, data);
  });
}


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

cd 
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

