/**
 * This module defines a course model in meal maker
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
    type        : String,
    required    : true,
    unique      : true
  },

  description: {
    type        : String,
    required    : true
  },

  maxStudents: {
    type: Number,
    default: 0,
    min: [0, 'A course cannot have a negative number of students']
  },

  cost: {
    type: Number,
    default: 0,
    min: [0, 'A course cannot have negative cost']
  },

  // check these two properties ICE
  /*items: [],

  zipCode: {
    type: Number,
    min: [10000, 'Zip Code too short'],
    max: 99999
  },*/
}, 

{
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);