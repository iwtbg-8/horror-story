import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
import { FaSkull, FaGhost, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [storiesRes, categoriesRes] = await Promise.all([
        axios.get('/api/stories/featured'),
        axios.get('/api/categories')
      ]);

      if (storiesRes.data.success) {
        setFeaturedStories(storiesRes.data.stories);
      }
      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <motion.h1 
            className="hero-title horror-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Dark Tales
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Where Nightmares Come to Life
          </motion.p>
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Dive into a world of spine-chilling horror stories that will haunt your dreams.
            From psychological thrillers to supernatural terrors, find your next nightmare here.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link to="/stories">
              <button className="hero-btn">
                <FaBook /> Start Reading
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">
            <FaSkull /> Featured Stories
          </h2>
          {loading ? (
            <div className="loading-spinner">Loading terrifying tales...</div>
          ) : (
            <div className="stories-grid">
              {featuredStories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          )}
          {!loading && featuredStories.length === 0 && (
            <p className="no-stories">No featured stories available yet...</p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">
            <FaGhost /> Explore by Category
          </h2>
          <div className="categories-grid">
            {categories.slice(0, 6).map((category) => (
              <Link 
                key={category._id} 
                to={`/stories?category=${category._id}`}
                className="category-card"
                style={{ borderColor: category.color }}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <p className="category-count">{category.storyCount} stories</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/categories">
              <button className="secondary-btn">View All Categories</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2 className="cta-title gothic-text">Ready to Face Your Fears?</h2>
          <p className="cta-description">
            Join our community of horror enthusiasts and never miss a terrifying tale.
          </p>
          <Link to="/register">
            <button className="cta-btn">Join Now - It's Free</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
