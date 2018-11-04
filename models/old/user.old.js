const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId }  = mongoose.SchemaTypes

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: { type: String, unique: true, required: true },
  name: String,
  lastName: String,
  owner:{ type: Boolean, default:false },
  favorites: [{ type: ObjectId, ref: 'Restaurant' }],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  following: [{ type: ObjectId, ref: 'User' }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
