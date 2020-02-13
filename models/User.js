const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: String,
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'moderator',
    enum: ['bar', 'door', 'clean', 'moderator', 'other']
  },
  administration: {
    type: String,
    default: 'admin',
    enum: ['member', 'admin']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
