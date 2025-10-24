const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Category = require('../models/Category');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all stories (with pagination and filters)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, difficulty, search, sort = '-createdAt' } = req.query;
    
    let query = { status: 'published' };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const stories = await Story.find(query)
      .populate('category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Don't send full content in list

    const count = await Story.countDocuments(query);

    res.json({
      success: true,
      stories,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalStories: count
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get featured stories
router.get('/featured', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'published', featured: true })
      .populate('category')
      .sort('-createdAt')
      .limit(6)
      .select('-content');

    res.json({ success: true, stories });
  } catch (error) {
    console.error('Get featured stories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single story by slug
router.get('/:slug', async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug, status: 'published' })
      .populate('category')
      .populate('createdBy', 'username');

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Increment views
    story.views += 1;
    await story.save();

    res.json({ success: true, story });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Like a story
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    story.likes += 1;
    await story.save();

    res.json({ success: true, likes: story.likes });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add to favorites
router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const storyId = req.params.id;

    if (user.favoriteStories.includes(storyId)) {
      // Remove from favorites
      user.favoriteStories = user.favoriteStories.filter(id => id.toString() !== storyId);
    } else {
      // Add to favorites
      user.favoriteStories.push(storyId);
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Favorites updated', 
      favoriteStories: user.favoriteStories 
    });
  } catch (error) {
    console.error('Favorite story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update reading progress
router.post('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;
    const user = await User.findById(req.user.id);
    const storyId = req.params.id;

    const existingIndex = user.readingHistory.findIndex(
      item => item.story.toString() === storyId
    );

    if (existingIndex !== -1) {
      user.readingHistory[existingIndex].progress = progress;
      user.readingHistory[existingIndex].lastReadAt = Date.now();
    } else {
      user.readingHistory.push({
        story: storyId,
        progress,
        lastReadAt: Date.now()
      });
    }

    await user.save();

    res.json({ success: true, message: 'Progress saved' });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
