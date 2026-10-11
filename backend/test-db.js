require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('Tim thay bien URI:', uri ? 'CO' : 'KHONG');

mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
  .then(() => { console.log('KET NOI THANH CONG'); process.exit(0); })
  .catch(err => { console.log('LOI:', err.message); process.exit(1); });
