import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import '../admin/Dashboard.css';
import '../admin/StoryForm.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await axios.delete(`/api/admin/users/${id}`);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="horror-title">Manage Users</h1>
        </div>

        <div className="dashboard-section">
          {loading ? (
            <div className="loading-spinner">Loading users...</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Favorites</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                          {user.username}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: user.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-green)'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{user.favoriteStories?.length || 0}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-icons">
                          {user.role !== 'admin' && (
                            <button onClick={() => handleDelete(user._id)} title="Delete">
                              <FaTrash className="icon-delete" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
