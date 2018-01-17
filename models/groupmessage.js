const mongoose = require('mongoose');

var groupMessage = new mongoose.Schema({
  body: {type: String},
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('GroupMessage', groupMessage);
