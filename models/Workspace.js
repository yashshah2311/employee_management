const mongoose = require('mongoose');

const workspaceSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phone: String,
  address: String,
  logo: String,
  password: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);