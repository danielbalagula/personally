const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new mongoose.Schema({
  user_id: Schema.Types.ObjectId,
  title: String,
  mood: Number,
  content: String,
  password_protected: Boolean,
  created_at: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('Entry', entrySchema);

module.exports = User;
