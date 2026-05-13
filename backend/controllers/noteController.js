const UserNote = require('../models/UserNote');

// Create note
const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roadmapId, subTechnologyId, title, content, tags, isPrivate } = req.body;

    if (!content) {
      return res.status(400).json({ msg: 'Note content is required' });
    }

    if (!roadmapId || !subTechnologyId) {
      return res.status(400).json({ msg: 'roadmapId and subTechnologyId are required' });
    }

    const note = new UserNote({
      userId,
      roadmapId,
      subTechnologyId,
      title: title || '',
      content,
      tags: tags || [],
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.log('Create note error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all user notes
const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roadmapId, subTechnologyId, tags } = req.query;

    let query = { userId };

    // Filter by roadmapId if provided
    if (roadmapId) {
      query.roadmapId = roadmapId;
    }

    // Filter by subTechnologyId if provided
    if (subTechnologyId) {
      query.subTechnologyId = subTechnologyId;
    }

    // Filter by tags if provided
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    const notes = await UserNote.find(query)
      .sort({ updatedAt: -1 })
      .limit(50); // Limit to 50 most recent notes

    res.status(200).json(notes);
  } catch (error) {
    console.log('Get user notes error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get single note by ID
const getNoteById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const note = await UserNote.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Update last accessed time
    note.lastAccessed = new Date();
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.log('Get note error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content, tags, isPrivate } = req.body;

    const note = await UserNote.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPrivate !== undefined) note.isPrivate = isPrivate;

    await note.save();
    res.status(200).json(note);
  } catch (error) {
    console.log('Update note error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const note = await UserNote.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    await UserNote.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Note deleted successfully' });
  } catch (error) {
    console.log('Delete note error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Search notes
const searchNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
    }

    const notes = await UserNote.find({
      userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(20);

    res.status(200).json({ notes, count: notes.length });
  } catch (error) {
    console.log('Search notes error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get note statistics
const getNoteStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalNotes = await UserNote.countDocuments({ userId });
    const publicNotes = await UserNote.countDocuments({ userId, isPrivate: false });
    const totalWords = await UserNote.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalWords: { $sum: '$wordCount' } } }
    ]);

    const notesByRoadmap = await UserNote.aggregate([
      { $match: { userId } },
      { $group: { _id: '$roadmapId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      totalNotes,
      publicNotes,
      totalWords: totalWords[0]?.totalWords || 0,
      notesByRoadmap,
      averageWordsPerNote: totalNotes > 0 ? Math.round((totalWords[0]?.totalWords || 0) / totalNotes) : 0
    });
  } catch (error) {
    console.log('Get note statistics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getNoteStatistics
};