const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const studentRoutes = require('./routes/students');

const app = express();

// Cấu hình CORS cho Production (Câu 58)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép: request không có origin (curl, Postman), domain trong danh sách, hoặc môi trường không phải production
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, false); // Chặn domain lạ
    }
  },
  credentials: true
}));

app.use(express.json());

// Kết nối MongoDB Atlas (Câu 33)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// API Hello test (Câu 22)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động thành công!' });
});

app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port