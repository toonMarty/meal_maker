const mongoose = require('mongoose');
const {Schema} = mongoose;
const Subscriber = require('./subscriber');

const passportLocalMongoose = require('passport-local-mongoose');

const coursesController = require('../controllers/coursesController');


const userSchema = new Schema({
  name: {
    first: {
      type  : String,
      trim  : true
    },

    last: {
      type: String,
      trim: true
    }
  },

  email: {
    type        : String,
    required    : true,
    lowercase   : true,
    unique      : true
  },

  zipCode: {
    type        : Number,
    min         : [10000, "Zip code too short"],
    max         : 99999
  },


  courses: [{
    type    : Schema.Types.ObjectId,
    ref     : "Course"
  }],

  subscribedAccount: {type: Schema.Types.ObjectId, ref: "Subscriber"}
},

{
    timestamps: true
});



userSchema.virtual("fullName")
.get(function() {
  return `${this.name.first} ${this.name.last}`
});

userSchema.virtual("letterCount")
.get(function() {
  let nameLength = this.name.first.length + this.name.last.length;
  return nameLength;
});

userSchema.virtual('firstLetter')
.get(function() {
  return this.name.first[0];
});

userSchema.pre("save", function(next) {
  /**
   * Find an association between a user and a
   * subscriber before saving a user to the
   * database
   */
  let user = this;

  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
    .then(subscriber => {
      user.subscribedAccount = subscriber;
      next();
    })
    .catch(error => {
      console.log(`Error connecting subscriber: ${error.message}`);
      next(error);
    })
  } else {
    next();
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email' 
});

module.exports = mongoose.model('User', userSchema);