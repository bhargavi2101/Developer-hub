const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getNoteStatistics
} = require('../controllers/noteController');

// Create note
router.post('/', authMiddleware, createNote);

// Get all user notes
router.get('/', authMiddleware, getUserNotes);

// Search notes
router.get('/search', authMiddleware, searchNotes);

// Get note statistics
router.get('/statistics', authMiddleware, getNoteStatistics);

// Get single note by ID
router.get('/:id', authMiddleware, getNoteById);

// Update note
router.put('/:id', authMiddleware, updateNote);

// Delete note
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;