const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const  { ObjectId }  = mongoose.SchemaTypes;

const commentSchema = new Schema({
  id: Number,
  text: String,
  language: String,
  rating: Number,
  polarity: Number,
  time: Date,
  source: String,
  wordsCount: Number,
  details: String
  },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
