const UserRoadmap = require('../models/UserRoadmap');

// GET user roadmaps
exports.getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.user.id; // coming from JWT

    const data = await UserRoadmap.find({ userId });

    res.json(data);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ADD roadmap for user
exports.addUserRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    const roadmap = await UserRoadmap.create({
      userId,
      title: req.body.title,
      progress: 0,
      color: req.body.color || '#3b82f6'
    });

    res.json(roadmap);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};