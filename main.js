/**App logic */

const express = require('express');
const router = express.Router();

const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const subscribersController = require('./controllers/subscribersController');
const usersController = require('./controllers/usersController');
const coursesController = require('./controllers/coursesController');

const User = require('./models/user');

const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const connectFlash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');
const app = express();

mongoose.connect('mongodb://localhost:27017/meal_maker', {useNewUrlParser: true});
mongoose.Promise = global.Promise;

/**Middleware to interpret incoming request bodies */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layouts);
app.use('/', router);

router.use(expressValidator());
router.use(methodOverride('_method', {'methods': ['GET', 'POST']}));
router.use(cookieParser("not_a_good_idea"));
router.use(expressSession({
  secret: "not_a_good_idea",
  cookie: {maxAge: 4000000},
  resave: false,
  saveUninitialized: false
}));
router.use(connectFlash());
router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

app.set("port", process.env.PORT || 4022);
app.set('view engine', 'ejs');

router.get('/', homeController.showCourses);

// router.get('/contact', subscribersController.new);
router.get('/subscribers', subscribersController.index, subscribersController.indexView);
router.get('/subscribers/new', subscribersController.new, subscribersController.redirectView);
router.get('/subscribers/:id', subscribersController.show, subscribersController.showView);
router.get('/subscribers/:id/edit', subscribersController.edit);

router.put('/subscribers/:id/update', subscribersController.update, subscribersController.redirectView);

router.delete('/subscribers/:id/delete', subscribersController.delete, subscribersController.redirectView);


// router.post('/subscribe', subscribersController.create);
router.post('/subscribers/create', subscribersController.create, subscribersController.redirectView);

router.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.get('/users/login', usersController.login);
router.post('/users/login', usersController.authenticate);
router.get('/users/logout', usersController.logout, usersController.redirectView);
router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/:id/edit', usersController.edit);

router.post('/users/create', usersController.validate, usersController.create, usersController.redirectView);

router.put('/users/:id/update', usersController.update, usersController.redirectView);

router.delete('/users/:id/delete', usersController.delete, usersController.redirectView);

// router.get('/courses/recipes')
router.get('/courses', coursesController.index, coursesController.indexView);
router.get('/courses/new', coursesController.new, coursesController.redirectView);
router.get('/courses/:id', coursesController.show, coursesController.showView);
router.get('/courses/:id/edit', coursesController.edit);

router.post('/courses/create', coursesController.create, coursesController.redirectView);

router.put('/courses/:id/update', coursesController.update, coursesController.redirectView);

router.delete('/courses/:id/delete', coursesController.delete, coursesController.redirectView);


app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
