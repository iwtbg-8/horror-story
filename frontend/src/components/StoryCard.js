import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaClock } from 'react-icons/fa';
import './StoryCard.css';

const StoryCard = ({ story }) => {
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
    <Link to={`/story/${story.slug}`} className="story-card">
      <div className="story-card-image">
        {story.coverImage ? (
          <img src={story.coverImage} alt={story.title} />
        ) : (
          <div className="story-card-placeholder">
            <span className="placeholder-icon">📖</span>
          </div>
        )}
        <div 
          className="story-difficulty-badge" 
          style={{ background: getDifficultyColor(story.difficulty) }}
        >
          {story.difficulty}
        </div>
      </div>
      
      <div className="story-card-content">
        <div className="story-card-category">
          {story.category?.icon} {story.category?.name}
        </div>
        
        <h3 className="story-card-title">{story.title}</h3>
        
        <p className="story-card-author">by {story.author}</p>
        
        <p className="story-card-excerpt">{story.excerpt}</p>
        
        <div className="story-card-footer">
          <div className="story-stats">
            <span><FaEye /> {story.views}</span>
            <span><FaHeart /> {story.likes}</span>
            <span><FaClock /> {story.readTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
