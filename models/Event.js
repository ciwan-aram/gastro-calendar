const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  description: String,
  name: String,
  owner: {
    type: Schema.Types.ObjectId, //??
    ref: 'User'
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
