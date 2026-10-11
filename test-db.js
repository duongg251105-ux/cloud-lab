require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('Tìm thấy biến URI:', uri ? 'CÓ' : 'KHÔNG');

mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
  .then(() => { console.log('KẾT NỐI THÀNH CÔNG'); process.exit(0); })
  .catch(err => { console.log('LỖI:', err.message); process.exit(1); });