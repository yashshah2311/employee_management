const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  companyName: String,
  companyAddress: String,
  experience: Number,
  department: String,
  joiningDate: Date,
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);