const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Category = require('../models/Category');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard Statistics
router.get('/stats', async (req, res) => {
  try {
    const totalStories = await Story.countDocuments();
    const publishedStories = await Story.countDocuments({ status: 'published' });
    const draftStories = await Story.countDocuments({ status: 'draft' });
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    const totalViews = await Story.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const totalLikes = await Story.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    const recentStories = await Story.find()
      .populate('category')
      .sort('-createdAt')
      .limit(5)
      .select('title author status createdAt views likes');

    const popularStories = await Story.find({ status: 'published' })
      .sort('-views')
      .limit(5)
      .select('title author views likes');

    res.json({
      success: true,
      stats: {
        totalStories,
        publishedStories,
        draftStories,
        totalUsers,
        totalCategories,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0
      },
      recentStories,
      popularStories
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all stories (admin view - includes drafts)
router.get('/stories', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const stories = await Story.find(query)
      .populate('category')
      .populate('createdBy', 'username email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Story.countDocuments(query);

    res.json({
      success: true,
      stories,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalStories: count
    });
  } catch (error) {
    console.error('Get admin stories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new story
router.post('/stories', async (req, res) => {
  try {
    const { title, author, content, excerpt, category, tags, difficulty, status, featured, coverImage, readTime } = req.body;

    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const story = new Story({
      title,
      slug,
      author,
      content,
      excerpt,
      category,
      tags: tags || [],
      difficulty: difficulty || 'moderate',
      status: status || 'published',
      featured: featured || false,
      coverImage: coverImage || '',
      readTime: readTime || Math.ceil(content.split(' ').length / 200),
      createdBy: req.user.id
    });

    await story.save();

    // Update category story count
    await Category.findByIdAndUpdate(category, { $inc: { storyCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      story
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update story
router.put('/stories/:id', async (req, res) => {
  try {
    const { title, author, content, excerpt, category, tags, difficulty, status, featured, coverImage, readTime } = req.body;
    
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const oldCategory = story.category;

    if (title) {
      story.title = title;
      story.slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (author) story.author = author;
    if (content) {
      story.content = content;
      story.readTime = readTime || Math.ceil(content.split(' ').length / 200);
    }
    if (excerpt) story.excerpt = excerpt;
    if (category && category !== oldCategory.toString()) {
      // Update category counts
      await Category.findByIdAndUpdate(oldCategory, { $inc: { storyCount: -1 } });
      await Category.findByIdAndUpdate(category, { $inc: { storyCount: 1 } });
      story.category = category;
    }
    if (tags) story.tags = tags;
    if (difficulty) story.difficulty = difficulty;
    if (status) story.status = status;
    if (featured !== undefined) story.featured = featured;
    if (coverImage) story.coverImage = coverImage;

    await story.save();

    res.json({
      success: true,
      message: 'Story updated successfully',
      story
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete story
router.delete('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Update category count
    await Category.findByIdAndUpdate(story.category, { $inc: { storyCount: -1 } });

    await Story.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Category Management
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = new Category({
      name,
      slug,
      description,
      icon: icon || '👻',
      color: color || '#8B0000'
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (description) category.description = description;
    if (icon) category.icon = icon;
    if (color) category.color = color;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has stories
    const storyCount = await Story.countDocuments({ category: req.params.id });
    if (storyCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with existing stories' 
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments();

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete admin users' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
