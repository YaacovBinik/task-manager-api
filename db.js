// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/task_manager');
    console.log('✅ מחובר ל־MongoDB');
  } catch (error) {
    console.error('❌ שגיאה בחיבור למסד הנתונים:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
