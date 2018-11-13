const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10
const { Schema } = mongoose


const { ObjectId }  = mongoose.SchemaTypes

const UserSchema = new Schema({
  username: { type: String, trim: true, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  name: String,
  lastname: String,
  languages: {
    type: String,
    enum: ['en', 'it', 'fr', 'nl', 'de', 'es' ],
    default: 'en' },
  favorites: [{ type: ObjectId, ref: 'Place'}],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  following: [{ type: ObjectId, ref: 'User' }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

UserSchema.pre('save', function (next)  {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {

    if (err) return next(err)
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      // console.log({ pwd: user.password, hash })
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User
