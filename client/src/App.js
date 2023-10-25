import  { useState, useEffect } from 'react';
import axios from 'axios';
 
// Functional component
export const App = () => {
  const [users, setUsers] = useState([]); // State for users
 
  // Fetch users from API
  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/users')
      .then(response => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
 
  // Event handler for refreshing users
  const handleRefresh = () => {
    // Fetch users again
    axios.get('http://localhost:3000/api/v1/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
 
  return{ users, handleRefresh }
};
 
