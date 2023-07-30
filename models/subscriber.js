/**
 * This module defines the subscriber model data
 * along with data validation
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriberSchema = new Schema({
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },

    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999
    },

    courses: [
      {
        type  : mongoose.Schema.Types.ObjectId,
        ref   : 'Course'
      }
    ]
},

{
  timestamps: true
});

subscriberSchema.methods.getInfo = function() {
  /** 
   * get information about a particular subscriber, i.e
   * a Subscriber instance
   */

  return `Name      : ${this.name}, 
          Email     : ${this.email}, 
          Zip Code  : ${this.zipCode}`
}

subscriberSchema.methods.findLocalSubscribers = function() {
  // find subscribers with the same zipcode, i.e from the same area
  return this.model('Subscriber')
  .find({zipCode: this.zipCode})
  .exec()
}

module.exports = mongoose.model('Subscriber', subscriberSchema);