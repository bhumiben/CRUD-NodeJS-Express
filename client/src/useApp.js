import React from 'react';
import {useApp} from './App2.js';

function App() {
    const{users, handleRefresh} = useApp();
return(
    <div>
      <h1>User List</h1>
      <button onClick={handleRefresh}>Refresh</button>
      <ul>
        {users && users.length > 0 ? (
          users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))
        ) : (
          <li>No users available</li>
        )}
      </ul>
    </div>
  )};

  export default App;

