const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        msg: 'Admin access required',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Check if admin account is banned
    if (req.user.isBanned) {
      return res.status(403).json({
        msg: 'Admin account has been banned',
        error: 'ACCOUNT_BANNED'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = adminMiddleware;