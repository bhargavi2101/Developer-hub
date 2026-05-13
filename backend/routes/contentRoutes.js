const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology,
  createSubTechnology,
  getSubTechnologyById,
  updateSubTechnology,
  deleteSubTechnology,
  getTechnologyCategories,
  validateContentStructure
} = require('../controllers/contentController');

// Technology CRUD
router.post('/technologies', authMiddleware, createTechnology);
router.get('/technologies', getAllTechnologies);
router.get('/technologies/:technologyId', getTechnologyById);
router.put('/technologies/:technologyId', authMiddleware, updateTechnology);
router.delete('/technologies/:technologyId', authMiddleware, deleteTechnology);

// Subtechnology CRUD
router.post('/subtechnologies', authMiddleware, createSubTechnology);
router.get('/subtechnologies/:subTechnologyId', getSubTechnologyById);
router.put('/subtechnologies/:subTechnologyId', authMiddleware, updateSubTechnology);
router.delete('/subtechnologies/:subTechnologyId', authMiddleware, deleteSubTechnology);

// Utilities
router.get('/categories', getTechnologyCategories);
router.get('/technologies/:technologyId/validate', authMiddleware, validateContentStructure);

module.exports = router;
