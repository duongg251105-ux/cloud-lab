const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const studentRoutes = require('./routes/students');

const app = express();
app.use(cors());
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
  console.log(`Server running on port ${PORT}`);
});