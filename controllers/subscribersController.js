/**
 * This module contains controller actions
 * for subscribers
 */

const subscriber = require('../models/subscriber');
const Subscriber = require('../models/subscriber');

const getSubscriberParams = (body) => {
  /**
   * get subscriber data from request
   */
  return {
    name    : body.name,
    email   : body.email,
    zipCode : parseInt(body.zipCode)
  }
}

module.exports = {
  index: (req, res, next) => {
    // find and display all subscribers
    Subscriber.find({})
    .then(subscribers => {
      res.locals.subscribers = subscribers;
      next();
    })
    .catch((err) => {
        console.log(`Error fetching subscribers: ${err.message}`);
        next(err);
    });
  },

  indexView: (req, res) => {
    res.render('subscribers/index');
  },

  new: (req, res) => {
    // get the newsletter subscription page
    res.render('subscribers/new');
  },

  create: (req, res, next) => {
    let subscriberParams = getSubscriberParams(req.body);
    Subscriber.create(subscriberParams)
    .then(subscriber => {
      req.flash('success', `Thank you ${subscriber.name} for your subscription`);
      res.locals.redirect = '/subscribers';
      res.locals.subscriber = subscriber;
      next();
    })
    .catch(error => {
      console.log(`Failed to save subscriber: ${error.message}`);
      res.locals.redirect = '/subscribers/new';
      req.flash('error', 'Unable to create subscriber');
      next();
    });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
    .then(subscriber => {
      res.locals.subscriber = subscriber;
      next();
    })
    .catch(error => {
      console.log(`Couldn't find subscriber: ${error.message}`);
      next(error);
    })
  },

  showView: (req, res) => {
    res.render('subscribers/show');
  },

  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
    .then(subscriber => {
      res.render('subscribers/edit', {subscriber: subscriber});
    })
    .catch(error => {
      console.log(`Error finding subscriber: ${error.message}`);
      next(error);
    })
  },

  update: (req, res, next) => {
    let subscriberId = req.params.id;
    let subscriberParams = getSubscriberParams(req.body);

    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams})
    .then(subscriber => {
      req.flash('success', `${subscriber.name} updated successfully`);
      res.locals.redirect = `/subscribers/${subscriberId}`;
      res.locals.subscriber = subscriber;
      next();
    })
    .catch(error => {
      console.log(`Couldn't update subscriber: ${error.message}`);
      res.locals.redirect = '/subscribers/${subscriberId}';
      req.flash('error', 'Unable to update subscriber');
      next();
    });
  },

  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
    .then(() => {
      req.flash('success', 'Subscriber deleted successfully');
      res.locals.redirect = '/subscribers';
      next();
    })
    .catch(error => {
      console.log(`Couldn't update subscriber: ${error.message}`);
      res.locals.redirect = '/subscribers/${subscriberId}';
      req.flash('error', 'Unable to delete subscriber');
      next();
    });
  }
}