import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function Forms() {
  const [view, setView] = useState('forms');
  const [users, setUsers] = useState([]);
  
  // Form states
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone_number: ''
  });
  
  const [hobbyForm, setHobbyForm] = useState({
    user_id: '',
    hobbies: ''
  });

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      alert('Error fetching users: ' + error.message);
    }
  };

  // Fetch users with hobbies for index page
  const fetchUsersHobbies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users-hobbies`);
      const data = await response.json();
      setUsersHobbies(data);
    } catch (error) {
      alert('Error fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // if (view === 'index') {
    //   fetchUsersHobbies();
    // }
  }, []);

  // Handle user form submission
  const handleUserSubmit = async () => {
    if (!userForm.first_name || !userForm.last_name) {
      alert('First name and last name are required');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      
      if (response.ok) {
        alert('User added successfully!');
        setUserForm({ first_name: '', last_name: '', address: '', phone_number: '' });
        fetchUsers();
      }
    } catch (error) {
      alert('Error adding user: ' + error.message);
    }
  };

  // Handle hobby form submission
  const handleHobbySubmit = async () => {
    if (!hobbyForm.user_id || !hobbyForm.hobbies) {
      alert('Please select a user and enter a hobby');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/hobbies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hobbyForm)
      });
      
      if (response.ok) {
        alert('Hobby added successfully!');
        setHobbyForm({ user_id: '', hobbies: '' });
      }
    } catch (error) {
      alert('Error adding hobby: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>User & Hobbies Manager</h1>
    
      <div>
          {/* Add New User Form */}
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '30px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#333', marginTop: '0' }}>Add New User</h2>
                <div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    First Name *
                    </label>
                    <input
                    type="text"
                    value={userForm.first_name}
                    onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                    }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Last Name *
                    </label>
                    <input
                    type="text"
                    value={userForm.last_name}
                    onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                    }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Address
                    </label>
                    <textarea
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        minHeight: '60px',
                        boxSizing: 'border-box'
                    }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Phone Number
                    </label>
                    <input
                    type="tel"
                    value={userForm.phone_number}
                    onChange={(e) => setUserForm({ ...userForm, phone_number: e.target.value })}
                    style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                    }}
                    />
                </div>
                
                <button 
                    onClick={handleUserSubmit}
                    style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                    }}
                >
                    Add User
                </button>
                </div>
            </div>

          {/* Add User Hobbies Form */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(22, 19, 19, 0.1)'
          }}>
            <h2 style={{ color: '#333', marginTop: '0' }}>Add User Hobbies</h2>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Select User *
                </label>
                <select
                  value={hobbyForm.user_id}
                  onChange={(e) => setHobbyForm({ ...hobbyForm, user_id: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Select a user --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Hobby *
                </label>
                <input
                  type="text"
                  value={hobbyForm.hobbies}
                  onChange={(e) => setHobbyForm({ ...hobbyForm, hobbies: e.target.value })}
                  placeholder="e.g., Reading, Swimming, Coding"
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <button 
                onClick={handleHobbySubmit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Add Hobby
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}