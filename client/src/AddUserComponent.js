// AddUserComponent.js
import React from 'react';

const AddUserComponent = () => {
  const addUser = async () => {
    const name = prompt('Enter user name:');
    if (name) {
      try {
        const response = await fetch('/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });

        const result = await response.json();
        console.log('User added:', result);
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={addUser}>Add User</button>
    </div>
  );
};

export default AddUserComponent;
