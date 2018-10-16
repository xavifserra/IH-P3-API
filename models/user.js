const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  { ObjectId }  = mongoose.SchemaTypes;

const companySchema = new Schema({
  username: { type: String, trim: true, required: true },
  email: { type: String, unique: true, required: true },
  password: String,
  favorites: [{ type: ObjectId, ref: 'Restaurant' }],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  following: [{ type: ObjectId, ref: 'User' }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
})

const User = mongoose.model('User', companySchema);

module.exports = User;
