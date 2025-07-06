// index.js
const connectDB = require("./db");
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const express = require("express");

const app = express();
app.use(express.json());

// ברירת מחדל
app.get("/", (req, res) => {
  res.send("ברוך הבא ל־Task Manager API!");
});

// ראוטים
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

// הפעלת השרת לאחר חיבור למסד הנתונים
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על פורט ${PORT}`);
  });
});
