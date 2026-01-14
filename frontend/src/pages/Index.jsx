import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function IndexPage() {
  const [usersHobbies, setUsersHobbies] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Delete hobby
  const handleDeleteHobby = async (userId, hobby) => {
    if (!confirm('Are you sure you want to delete this hobby?')) return;
    
    try {
      const response = await fetch(`${API_URL}/hobbies/${userId}/${encodeURIComponent(hobby)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Hobby deleted successfully!');
        fetchUsersHobbies();
      }
    } catch (error) {
      alert('Error deleting hobby: ' + error.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? All their hobbies will also be deleted.')) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsersHobbies();
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUsersHobbies();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Users and Their Hobbies</h1>

      <div>
        {/* <h2 style={{ color: '#333' }}>Users and Their Hobbies</h2> */}
          
        {loading ? (
        <p>Loading...</p>
        ) : usersHobbies.length === 0 ? (
        <p>No users found. Add some users first!</p>
        ) : (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <thead>
                  <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>First Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Last Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Address</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Phone Number</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Hobby</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersHobbies.map((row, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.id}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.first_name}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.last_name}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.address || 'N/A'}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.phone_number || 'N/A'}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.hobbies || 'No hobbies'}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {row.hobbies ? (
                          <button
                            onClick={() => handleDeleteHobby(row.id, row.hobbies)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              marginRight: '5px'
                            }}
                          >
                            Delete Hobby
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(row.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Delete User
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}