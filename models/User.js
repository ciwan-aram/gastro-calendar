const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  role: {
    //                                                                Correct?
    type: String,
    default: 'moderator',
    enum: ['member1', 'member2', 'member3', 'member4', 'moderator']
  },
  administration: {
    type: String,
    default: 'admin',
    enum: ['member', 'admin']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
