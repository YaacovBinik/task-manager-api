// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Middleware לבדוק טוקן ולהוציא את userId
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'אין טוקן' });

  try {
    const decoded = jwt.verify(token, 'NYBinik');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'טוקן לא תקף' });
  }
};

// 🔹 יצירת משימה חדשה
router.post('/tasks', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title, userId: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה ביצירת משימה' });
  }
});

// 🔄 עדכון משימה (למשל: כותרת או סטטוס ביצוע)
router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'משימה לא נמצאה או לא שייכת לך' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון המשימה' });
  }
});

// 🗑️ מחיקת משימה
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: 'משימה לא נמצאה או לא שייכת לך' });
    }

    res.json({ message: 'המשימה נמחקה' });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה במחיקת המשימה' });
  }
});


// 🔎 שליפת משימות עם סינון לפי completed
router.get('/tasks', auth, async (req, res) => {
  try {
    const filter = { userId: req.userId };

    // אם יש פרמטר completed ב־query (true/false)
    if (req.query.completed) {
      filter.completed = req.query.completed === 'true';
    }

    // אפשר להוסיף כאן עוד פילטרים בעתיד (לדוג׳ לפי תאריך)

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשליפת משימות' });
  }
});



module.exports = router;
