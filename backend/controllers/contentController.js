const Technology = require('../models/Technology');
const SubTechnology = require('../models/SubTechnology');
const UserRoadmap = require('../models/UserRoadmap');

// TECHNOLOGY MANAGEMENT

// Create new technology
const createTechnology = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      category,
      difficulty,
      icon,
      color,
      tags,
      prerequisites,
      estimatedTime,
      isFeatured,
      sortOrder
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ msg: 'Name, description, and category are required' });
    }

    const technology = new Technology({
      name,
      description,
      category,
      difficulty,
      icon,
      color,
      tags,
      prerequisites,
      estimatedTime,
      isFeatured,
      sortOrder,
      createdBy: userId,
      updatedBy: userId
    });

    await technology.save();

    res.status(201).json(technology);
  } catch (error) {
    console.log('Create technology error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all technologies
const getAllTechnologies = async (req, res) => {
  try {
    const { category, difficulty, featured, active = true } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;
    if (active !== 'false') query.isActive = true;

    const technologies = await Technology.find(query)
      .populate('prerequisites', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    // Add subtechnology counts
    const enrichedTechnologies = await Promise.all(
      technologies.map(async (tech) => {
        const subTechCount = await SubTechnology.countDocuments({
          technologyId: tech._id,
          isActive: true
        });

        return {
          ...tech.toObject(),
          subTechnologiesCount: subTechCount
        };
      })
    );

    res.status(200).json(enrichedTechnologies);
  } catch (error) {
    console.log('Get all technologies error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get technology by ID
const getTechnologyById = async (req, res) => {
  try {
    const { technologyId } = req.params;

    const technology = await Technology.findById(technologyId)
      .populate('prerequisites', 'name slug description');

    if (!technology) {
      return res.status(404).json({ msg: 'Technology not found' });
    }

    // Get subtechnologies
    const subTechnologies = await SubTechnology.find({
      technologyId: technologyId,
      isActive: true
    })
      .populate('prerequisites', 'name')
      .sort({ order: 1 });

    res.status(200).json({
      ...technology.toObject(),
      subTechnologies,
      subTechnologiesCount: subTechnologies.length
    });
  } catch (error) {
    console.log('Get technology by ID error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update technology
const updateTechnology = async (req, res) => {
  try {
    const userId = req.user.id;
    const { technologyId } = req.params;
    const updates = req.body;

    const technology = await Technology.findById(technologyId);
    if (!technology) {
      return res.status(404).json({ msg: 'Technology not found' });
    }

    Object.keys(updates).forEach(key => {
      technology[key] = updates[key];
    });

    technology.updatedBy = userId;
    technology.updatedAt = new Date();

    await technology.save();

    res.status(200).json(technology);
  } catch (error) {
    console.log('Update technology error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete technology
const deleteTechnology = async (req, res) => {
  try {
    const { technologyId } = req.params;

    const technology = await Technology.findById(technologyId);
    if (!technology) {
      return res.status(404).json({ msg: 'Technology not found' });
    }

    // Check if technology has user roadmaps
    const roadmapCount = await UserRoadmap.countDocuments({ technologyId });
    if (roadmapCount > 0) {
      return res.status(400).json({
        msg: 'Cannot delete technology with active user roadmaps',
        roadmapCount
      });
    }

    // Delete subtechnologies
    await SubTechnology.deleteMany({ technologyId });

    // Delete technology
    await Technology.deleteOne({ _id: technologyId });

    res.status(200).json({ msg: 'Technology deleted successfully' });
  } catch (error) {
    console.log('Delete technology error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// SUBTECHNOLOGY MANAGEMENT

// Create subtechnology
const createSubTechnology = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      technologyId,
      name,
      description,
      content,
      difficulty,
      order,
      duration,
      objectives,
      prerequisites,
      resources
    } = req.body;

    if (!technologyId || !name || !description || !content) {
      return res.status(400).json({ msg: 'Technology ID, name, description, and content are required' });
    }

    const technology = await Technology.findById(technologyId);
    if (!technology) {
      return res.status(404).json({ msg: 'Technology not found' });
    }

    const subTechnology = new SubTechnology({
      technologyId,
      name,
      description,
      content,
      difficulty,
      order,
      duration,
      objectives,
      prerequisites,
      resources,
      createdBy: userId,
      updatedBy: userId
    });

    await subTechnology.save();

    res.status(201).json(subTechnology);
  } catch (error) {
    console.log('Create subtechnology error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get subtechnology by ID
const getSubTechnologyById = async (req, res) => {
  try {
    const { subTechnologyId } = req.params;

    const subTechnology = await SubTechnology.findById(subTechnologyId)
      .populate('technologyId', 'name slug description category')
      .populate('prerequisites', 'name description');

    if (!subTechnology) {
      return res.status(404).json({ msg: 'Subtechnology not found' });
    }

    res.status(200).json(subTechnology);
  } catch (error) {
    console.log('Get subtechnology by ID error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update subtechnology
const updateSubTechnology = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subTechnologyId } = req.params;
    const updates = req.body;

    const subTechnology = await SubTechnology.findById(subTechnologyId);
    if (!subTechnology) {
      return res.status(404).json({ msg: 'Subtechnology not found' });
    }

    Object.keys(updates).forEach(key => {
      subTechnology[key] = updates[key];
    });

    subTechnology.updatedBy = userId;
    subTechnology.updatedAt = new Date();

    await subTechnology.save();

    res.status(200).json(subTechnology);
  } catch (error) {
    console.log('Update subtechnology error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete subtechnology
const deleteSubTechnology = async (req, res) => {
  try {
    const { subTechnologyId } = req.params;

    const subTechnology = await SubTechnology.findById(subTechnologyId);
    if (!subTechnology) {
      return res.status(404).json({ msg: 'Subtechnology not found' });
    }

    // Check if subtechnology has user progress
    const progressCount = await UserRoadmap.countDocuments({
      'progress.subTechnologyId': subTechnologyId
    });

    if (progressCount > 0) {
      return res.status(400).json({
        msg: 'Cannot delete subtechnology with user progress',
        progressCount
      });
    }

    await SubTechnology.deleteOne({ _id: subTechnologyId });

    res.status(200).json({ msg: 'Subtechnology deleted successfully' });
  } catch (error) {
    console.log('Delete subtechnology error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get technology categories
const getTechnologyCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'frontend', label: 'Frontend Development', icon: '🎨' },
      { value: 'backend', label: 'Backend Development', icon: '⚙️' },
      { value: 'mobile', label: 'Mobile Development', icon: '📱' },
      { value: 'devops', label: 'DevOps', icon: '🚀' },
      { value: 'data-science', label: 'Data Science', icon: '📊' },
      { value: 'ai/ml', label: 'AI/ML', icon: '🤖' },
      { value: 'security', label: 'Cybersecurity', icon: '🔒' },
      { value: 'other', label: 'Other', icon: '📦' }
    ];

    res.status(200).json(categories);
  } catch (error) {
    console.log('Get technology categories error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Validate content structure
const validateContentStructure = async (req, res) => {
  try {
    const { technologyId } = req.params;

    const technology = await Technology.findById(technologyId);
    if (!technology) {
      return res.status(404).json({ msg: 'Technology not found' });
    }

    const subTechnologies = await SubTechnology.find({ technologyId });

    const issues = [];

    // Check for missing content
    subTechnologies.forEach(subTech => {
      if (!subTech.content || subTech.content.trim().length === 0) {
        issues.push({
          type: 'missing_content',
          subTechnology: subTech.name,
          message: 'Subtechnology has no content'
        });
      }

      if (!subTech.description || subTech.description.trim().length === 0) {
        issues.push({
          type: 'missing_description',
          subTechnology: subTech.name,
          message: 'Subtechnology has no description'
        });
      }

      if (!subTech.objectives || subTech.objectives.length === 0) {
        issues.push({
          type: 'missing_objectives',
          subTechnology: subTech.name,
          message: 'Subtechnology has no learning objectives'
        });
      }
    });

    // Check for ordering issues
    const orders = subTechnologies.map(st => st.order).sort((a, b) => a - b);
    const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
    if (duplicateOrders.length > 0) {
      issues.push({
        type: 'duplicate_orders',
        message: 'Duplicate order values found',
        orders: duplicateOrders
      });
    }

    res.status(200).json({
      isValid: issues.length === 0,
      issues,
      totalSubTechnologies: subTechnologies.length,
      issuesCount: issues.length
    });
  } catch (error) {
    console.log('Validate content structure error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  // Technology CRUD
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology,

  // Subtechnology CRUD
  createSubTechnology,
  getSubTechnologyById,
  updateSubTechnology,
  deleteSubTechnology,

  // Utilities
  getTechnologyCategories,
  validateContentStructure
};
