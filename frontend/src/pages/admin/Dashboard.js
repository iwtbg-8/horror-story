import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBook, FaUsers, FaFolder, FaEye, FaHeart, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      if (response.data.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="horror-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage your horror story empire</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-red)' }}>
              <FaBook />
            </div>
            <div className="stat-content">
              <h3>{stats.stats.totalStories}</h3>
              <p>Total Stories</p>
              <span className="stat-detail">
                {stats.stats.publishedStories} published, {stats.stats.draftStories} drafts
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-purple)' }}>
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-green)' }}>
              <FaFolder />
            </div>
            <div className="stat-content">
              <h3>{stats.stats.totalCategories}</h3>
              <p>Categories</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ff9800' }}>
              <FaEye />
            </div>
            <div className="stat-content">
              <h3>{stats.stats.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e91e63' }}>
              <FaHeart />
            </div>
            <div className="stat-content">
              <h3>{stats.stats.totalLikes}</h3>
              <p>Total Likes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#2196f3' }}>
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>{(stats.stats.totalLikes / stats.stats.totalStories || 0).toFixed(1)}</h3>
              <p>Avg Likes/Story</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/stories/new" className="action-btn">
              <FaBook /> Create New Story
            </Link>
            <Link to="/admin/stories" className="action-btn">
              <FaBook /> Manage Stories
            </Link>
            <Link to="/admin/categories" className="action-btn">
              <FaFolder /> Manage Categories
            </Link>
            <Link to="/admin/users" className="action-btn">
              <FaUsers /> Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="dashboard-section">
          <h2>Recent Stories</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentStories.map((story) => (
                  <tr key={story._id}>
                    <td>{story.title}</td>
                    <td>{story.author}</td>
                    <td>
                      <span className={`status-badge status-${story.status}`}>
                        {story.status}
                      </span>
                    </td>
                    <td>{story.views}</td>
                    <td>{story.likes}</td>
                    <td>{new Date(story.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Stories */}
        <div className="dashboard-section">
          <h2>Most Popular Stories</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Views</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {stats.popularStories.map((story) => (
                  <tr key={story._id}>
                    <td>{story.title}</td>
                    <td>{story.author}</td>
                    <td>{story.views}</td>
                    <td>{story.likes}</td>
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

export default Dashboard;
