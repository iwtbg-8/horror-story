import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaHeart, FaClock, FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './StoryDetail.css';

const StoryDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [slug]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`/api/stories/${slug}`);
      if (response.data.success) {
        setStory(response.data.story);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to like stories');
      return;
    }

    try {
      const response = await axios.post(`/api/stories/${story._id}/like`);
      if (response.data.success) {
        setStory({ ...story, likes: response.data.likes });
        setLiked(true);
        toast.success('Story liked!');
      }
    } catch (error) {
      console.error('Error liking story:', error);
      toast.error('Failed to like story');
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to save favorites');
      return;
    }

    try {
      const response = await axios.post(`/api/stories/${story._id}/favorite`);
      if (response.data.success) {
        setFavorited(!favorited);
        toast.success(favorited ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (error) {
      console.error('Error favoriting story:', error);
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading your nightmare...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container">
        <div className="error-message">Story not found</div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      mild: '#4caf50',
      moderate: '#ff9800',
      intense: '#f44336',
      extreme: '#8B0000'
    };
    return colors[difficulty] || colors.moderate;
  };

  return (
    <div className="story-detail-page">
      {/* Story Header */}
      <div className="story-header">
        {story.coverImage && (
          <div className="story-header-image">
            <img src={story.coverImage} alt={story.title} />
            <div className="story-header-overlay"></div>
          </div>
        )}
        <div className="container story-header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="story-category-badge">
              {story.category?.icon} {story.category?.name}
            </div>
            <h1 className="story-title gothic-text">{story.title}</h1>
            <p className="story-author">Written by {story.author}</p>
            
            <div className="story-meta">
              <div className="story-stats-row">
                <span className="stat-item">
                  <FaEye /> {story.views} views
                </span>
                <span className="stat-item">
                  <FaHeart /> {story.likes} likes
                </span>
                <span className="stat-item">
                  <FaClock /> {story.readTime} min read
                </span>
                <span 
                  className="stat-item difficulty-badge"
                  style={{ background: getDifficultyColor(story.difficulty) }}
                >
                  {story.difficulty}
                </span>
              </div>
            </div>

            <div className="story-actions">
              <button 
                className={`action-btn ${liked ? 'active' : ''}`}
                onClick={handleLike}
              >
                <FaHeart /> {liked ? 'Liked' : 'Like'}
              </button>
              <button 
                className={`action-btn ${favorited ? 'active' : ''}`}
                onClick={handleFavorite}
              >
                <FaBookmark /> {favorited ? 'Saved' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story Content */}
      <div className="story-content-section">
        <div className="container">
          <motion.div 
            className="story-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="story-excerpt">
              <p>{story.excerpt}</p>
            </div>
            
            <div className="story-body">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {story.tags && story.tags.length > 0 && (
              <div className="story-tags">
                <h3>Tags:</h3>
                <div className="tags-list">
                  {story.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
