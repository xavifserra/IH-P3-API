const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  { ObjectId }  = mongoose.SchemaTypes;

const commentSchema = new Schema({
  id: Number,
  language: String,
  polarity: Number,
  rating: Number,
  source: String,
  text: String,
  time: Date,
  wordsCount: Number,
  details: String
  },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
