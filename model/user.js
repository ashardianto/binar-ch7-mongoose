const { Schema, model } = require('mongoose');

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  room: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room'
    }
  ],
});

module.exports = model('User', schema);