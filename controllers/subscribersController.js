/**
 * This module contains controller actions
 * for subscribers
 */

const Subscriber = require('../models/subscriber');

exports.getAllSubscribers = (req, res) => {
    // find and display all subscribers
    Subscriber.find({})
    .then((subscribers) => {
        res.render('subscribers', {subscribers: subscribers});
    })
    .catch((err) => {
        console.log(err.message);
        return [];
    });
}

exports.getSubscriptionPage = (req, res) => {
    // get the newsletter subscription page
    res.render('contact');
}

exports.saveSubscriber = (req, res) => {
    const newSubscriber = new Subscriber({
      name      : req.body.name,
      email     : req.body.email,
      zipCode   : req.body.zipCode
    });

    newSubscriber.save()
    .then(() => {
      res.render('thanks');
    })
    .catch(err => {
       res.send(err);
    });
}