import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="categories-page container">
      <h1 className="page-title horror-title">Story Categories</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category._id} className="category-card" style={{ borderColor: category.color }}>
            <div className="category-icon" style={{ color: category.color }}>
              {category.icon}
            </div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <span className="category-count">{category.storyCount} stories</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
