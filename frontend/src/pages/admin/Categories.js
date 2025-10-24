import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import '../admin/Dashboard.css';
import '../admin/StoryForm.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '👻',
    color: '#8B0000'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingId) {
        response = await axios.put(`/api/admin/categories/${editingId}`, formData);
      } else {
        response = await axios.post('/api/admin/categories', formData);
      }

      if (response.data.success) {
        toast.success(editingId ? 'Category updated' : 'Category created');
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', description: '', icon: '👻', color: '#8B0000' });
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will fail if the category has stories.')) return;

    try {
      const response = await axios.delete(`/api/admin/categories/${id}`);
      if (response.data.success) {
        toast.success('Category deleted');
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="horror-title">Manage Categories</h1>
          <button className="action-btn" onClick={() => setShowForm(!showForm)}>
            <FaPlus /> {showForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>

        {showForm && (
          <div className="dashboard-section">
            <h2>{editingId ? 'Edit Category' : 'Create Category'}</h2>
            <form onSubmit={handleSubmit} className="story-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="form-input"
                    placeholder="👻"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="form-input"
                  style={{ height: '50px' }}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', description: '', icon: '👻', color: '#8B0000' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="dashboard-section">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Color</th>
                  <th>Stories</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td style={{ fontSize: '2rem' }}>{category.icon}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          background: category.color,
                          borderRadius: '4px'
                        }}
                      />
                    </td>
                    <td>{category.storyCount}</td>
                    <td>
                      <div className="action-icons">
                        <button onClick={() => handleEdit(category)} title="Edit">
                          <FaEdit className="icon-edit" />
                        </button>
                        <button onClick={() => handleDelete(category._id)} title="Delete">
                          <FaTrash className="icon-delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
