const User = require('../models/user');
const passport = require('passport');
const httpStatus = require('http-status-codes');
const jsonWebToken = require('jsonwebtoken');

const getUserParams = (body) => {
  return {
    name: {
      first     : body.first,
      last      : body.last
    },
    email       : body.email,
    password    : body.password,
    zipCode     : body.zipCode
  }
}

const token = process.env.TOKEN || 'm34lmak3rt0k3n';

module.exports = {
  index: (req, res, next) => {
    // controller action to fetch users from the database
    User.find({})
    .then(users => {
        res.locals.users = users;
        next();
    })
    .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
    });
  },

  indexView: (req, res) => {
    // controller action to render a user index page
    res.render('users/index');
  },

  new: (req, res) => {
    // controller action to render a create user form view
    res.render('users/new');
  },

  validate: (req, res, next) => {
    // validate incoming form data
    req.sanitizeBody("email").normalizeEmail({all_lowercase: true}).trim();
    req.check('email', 'Invalid email address').isEmail();
    req.check('zipCode', 'Invalid zip code')
    .notEmpty()
    .isInt()
    .isLength({
      min: 5,
      max: 5
    })
    .equals(req.body.zipCode);

    req.check('password', 'Password cannot be empty').notEmpty().isLength({min: 8});

    // collect results of previous validations
    req.getValidationResult()
    .then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg); // store validation error messages in the variable messages
        req.skip = true;                              // skip next middleware, in this case, create, and not process form inputs until validation criteria is met
        req.flash('error', messages.join(' and '));   // add these messages to our flash messages, joining the series of error messages with "and"
        res.locals.redirect = '/users/new';         // redirect user to same view to enter data that meets validation criteria
        next();
      } else {
        // form data meets all validation criteria
        // call next middleware function, create, to create our user
        next();
      }

    })
  },

  create: (req, res, next) => {
    if (req.skip) next();
    // save a user to the database
    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash('success', `${user.fullName}'s account created successfully`);
        res.locals.redirect = '/users';
        next();
      } else {
        req.flash('error', `Account creation failed: ${error.message}`);
        res.locals.redirect = '/users/new';
        next();
      }
    });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    /**
     * Show a particular user's profile
     */

    let userId = req.params.id;

    User.findById(userId)
    .then(user => {
      res.locals.user = user;
      next();
    }).catch(error => {
      console.log(`Could not find user: ${error.message}`);
      next(error);
    });
  },

  showView: (req, res) => {
    res.render('users/show');
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
    .then(user => {
      res.render('users/edit', {user: user});
    })
    .catch(error => {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    });
  },

  update: (req, res, next) => {
    let userId = req.params.id;
    let userParams = {
      name: {
        first : req.body.first,
        last  : req.body.last
      },
      email   : req.body.email,
      password: req.body.password,
      zipCode : req.body.zipCode
    };

    User.findByIdAndUpdate(userId, {$set: userParams})
    .then(user => {
      req.flash('success', `${user.fullName}'s profile updated successfully`);
      res.locals.redirect = `/users/${userId}`;
      res.locals.user = user;
      next();
    })
    .catch(error => {
      console.log(`Error updating user: ${error.message}`);
      res.locals.redirect = '/users/${userId}';
      req.flash('error', `Couldn't update user profile`);
      next();
    });
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
    .then(() => {
      req.flash('success', `Account deleted successfully`);
      res.locals.redirect = '/users';
      next();
    })
    .catch(error => {
      console.log(`Failed to delete user: ${error.message}`);
      res.locals.redirect = '/users/${userId}';
      req.flash('error', 'Unable to delete user');
      next();
    });
  },

  login: (req, res) => {
    res.render('users/login');
  },

  authenticate: passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Failed to login',
    successRedirect: '/',
    successFlash: 'Logged in Successfully'
  }),

  logout: (req, res, next) => {
    req.logout(
      function(err) {
        if (err) { return next(); }

        req.flash('success', 'You have been Logged out');
        res.locals.redirect = '/';
        next();
    });
  },

  verifyToken: (req, res, next) => {
    let token = req.query.apiToken;

    if (token) {
      User.findOne({ apiToken: token})
      .then(user => {
        if (user) next();
        else next(new Error('Invalid API token'));
      })
      .catch(error => {
        next(new Error(error.message));
      });
    } else {
      next(new Error('Invalid API token'));
    }
  },

  apiAuthenticate: (req, res, next) => {
    passport.authenticate('local', (errors, user)=> {
      if (user) {
        let signedToken = jsonWebToken.sign({
          data: user._id,
          exp: new Date().setDate(new Date().getDate() + 1)
        }, "secret_encoding_passphrase"
        );
        res.json({
          success: true,
          token: signedToken
        });
      } else res.json({
        success: false, 
        message: 'Unable to authenticate user'
      });
    })(req, res, next);
  },

  verifyJWT: (req, res, next) => {
    let token = req.headers.token;

    if (token) {
      jsonWebToken.verify(
        token,
        "secret_encoding_passphrase",
        (errors, payload) => {
          if (payload) {
            User.findById(payload.data).then(user => {
              if (user) {
                next();
              } else {
                res.status(httpStatus.StatusCodes.FORBIDDEN).json({
                  error: true,
                  message: "User not found"
                });
              }
            });
          } else {
            res.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
              error: true,
              message: "Cannot verify API token"
            });
            next();
          }
        }
      );
    } else {
      res.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
        error: true,
        message: "Provide Token"
      });
    }
  }
};