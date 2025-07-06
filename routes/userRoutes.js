// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// הרשמה של משתמש חדש
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'משתמש כבר קיים עם המייל הזה' });
    }

    // יצירת משתמש חדש
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'המשתמש נוצר בהצלחה!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});

// 🔐 התחברות של משתמש קיים
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // בדיקה אם המשתמש קיים
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'משתמש לא נמצא' });
    }

    // השוואת סיסמאות
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'סיסמה שגויה' });
    }

    // יצירת טוקן
    const token = jwt.sign({ userId: user._id }, 'NYBinik', {
      expiresIn: '1h',
    });

    res.json({ message: 'התחברת בהצלחה', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});

module.exports = router;
