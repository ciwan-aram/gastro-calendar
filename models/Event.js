const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: String, //user.username
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date,
  startTime: String,
  endTime: String,
  description: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
