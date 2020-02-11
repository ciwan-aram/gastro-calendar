const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  role: {
    type: String,
    default: 'member1',
    enum: ['member1', 'member2', 'member3', 'member4', 'admin']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
