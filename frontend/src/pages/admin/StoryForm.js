import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StoryForm.css';

const AdminStoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    difficulty: 'moderate',
    status: 'published',
    featured: false,
    coverImage: '',
    readTime: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchStory();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/admin/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStory = async () => {
    try {
      const response = await axios.get(`/api/admin/stories?search=`);
      if (response.data.success) {
        const story = response.data.stories.find(s => s._id === id);
        if (story) {
          setFormData({
            title: story.title,
            author: story.author,
            content: story.content,
            excerpt: story.excerpt,
            category: story.category._id,
            tags: story.tags.join(', '),
            difficulty: story.difficulty,
            status: story.status,
            featured: story.featured,
            coverImage: story.coverImage || '',
            readTime: story.readTime
          });
        }
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      toast.error('Failed to load story');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let response;
      if (id) {
        response = await axios.put(`/api/admin/stories/${id}`, dataToSend);
      } else {
        response = await axios.post('/api/admin/stories', dataToSend);
      }

      if (response.data.success) {
        toast.success(id ? 'Story updated successfully' : 'Story created successfully');
        navigate('/admin/stories');
      }
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error(error.response?.data?.message || 'Failed to save story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="horror-title">{id ? 'Edit Story' : 'Create New Story'}</h1>
        </div>

        <div className="dashboard-section">
          <form onSubmit={handleSubmit} className="story-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows="3"
                maxLength="300"
                className="form-input"
                placeholder="A brief description (max 300 characters)"
              />
              <small>{formData.excerpt.length}/300 characters</small>
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="15"
                className="form-input"
                placeholder="Write your horror story here..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="intense">Intense</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label>Read Time (minutes)</label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Auto-calculated if left empty"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="ghost, haunted, supernatural"
              />
            </div>

            <div className="form-group">
              <label>Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="form-input"
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <span>Featured Story</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (id ? 'Update Story' : 'Create Story')}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/admin/stories')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminStoryForm;
