import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status === 404) {
          throw new Error(`API route not found: ${errorMessage}`);
        } else {
          throw new Error(`Failed to fetch users: ${response.status} - ${errorMessage}`);
        }
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Unable to fetch users: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error adding user: ${response.status} - ${errorMessage}`);
      }

      const addedUser = await response.json();
      setUsers([...users, addedUser]); // Add the new user to the local state
      setNewUser({ username: '', password: '' });
      setError(''); // Reset error
    } catch (error) {
      console.error('Error adding user:', error);
      setError(`Failed to add user: ${error.message}`);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ username: user.username, password: '' });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error updating user: ${response.status} - ${errorMessage}`);
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      setEditingUser(null);
      setNewUser({ username: '', password: '' });
      setError(''); // Reset error
    } catch (error) {
      console.error('Error updating user:', error);
      setError(`Failed to update user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error deleting user: ${response.status} - ${errorMessage}`);
      }

      setUsers(users.filter(user => user.id !== id)); // Update local state after deleting
      setError(''); // Reset error
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(`Failed to delete user: ${error.message}`);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '2px solid #007bff', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: '0' }}>User Management</h2>
        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/products" style={{ color: '#007bff', textDecoration: 'none' }}>Product Management</Link>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        </nav>
      </header>

      {error && <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}

      <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <input type="text" name="username" placeholder="Username" value={newUser.username} onChange={handleInputChange} required style={{ padding: '12px', margin: '8px 0', border: '1px solid #007bff', borderRadius: '5px', fontSize: '16px' }} />
        <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={handleInputChange} required style={{ padding: '12px', margin: '8px 0', border: '1px solid #007bff', borderRadius: '5px', fontSize: '16px' }} />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {editingUser ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead style={{ backgroundColor: '#007bff', color: '#fff' }}>
          <tr>
            <th style={{ padding: '12px' }}>Username</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '12px' }}>{user.username}</td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => handleEditUser(user)} style={{ backgroundColor: '#ffc107', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 12px', marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 12px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
