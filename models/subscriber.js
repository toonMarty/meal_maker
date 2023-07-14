/**
 * This module defines the subscriber model data
 */

const mongoose = require('mongoose');

const subscriberSchema = mongoose.Schema({
    name    : String,
    email   : String,
    zipCode : Number
});

module.exports = mongoose.model('Subscriber', subscriberSchema);