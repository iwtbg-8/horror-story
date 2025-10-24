import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import '../admin/Dashboard.css';

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  useEffect(() => {
    fetchStories();
  }, [filters]);

  const fetchStories = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`/api/admin/stories?${params.toString()}`);
      if (response.data.success) {
        setStories(response.data.stories);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      const response = await axios.delete(`/api/admin/stories/${id}`);
      if (response.data.success) {
        toast.success('Story deleted successfully');
        fetchStories();
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="horror-title">Manage Stories</h1>
          <Link to="/admin/stories/new">
            <button className="action-btn">
              <FaPlus /> Create New Story
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="dashboard-section">
          <div className="filters-row">
            <input
              type="text"
              placeholder="Search stories..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="filter-input"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Stories Table */}
        <div className="dashboard-section">
          {loading ? (
            <div className="loading-spinner">Loading stories...</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr key={story._id}>
                      <td>{story.title}</td>
                      <td>{story.author}</td>
                      <td>{story.category?.name}</td>
                      <td>
                        <span className={`status-badge status-${story.status}`}>
                          {story.status}
                        </span>
                      </td>
                      <td>{story.views}</td>
                      <td>{story.likes}</td>
                      <td>{new Date(story.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-icons">
                          <Link to={`/story/${story.slug}`} title="View">
                            <FaEye className="icon-view" />
                          </Link>
                          <Link to={`/admin/stories/edit/${story._id}`} title="Edit">
                            <FaEdit className="icon-edit" />
                          </Link>
                          <button onClick={() => handleDelete(story._id)} title="Delete">
                            <FaTrash className="icon-delete" />
                          </button>
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

export default AdminStories;
