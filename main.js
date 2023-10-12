/**App logic */

const express = require('express');
const router = require('./routes/index');

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

mongoose.connect('mongodb://127.0.0.1:27017/meal_maker', {useNewUrlParser: true});
mongoose.Promise = global.Promise;

/**Middleware to interpret incoming request bodies */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layouts);


app.use(expressValidator());
app.use(methodOverride('_method', {'methods': ['GET', 'POST']}));
app.use(cookieParser("not_a_good_idea"));
app.use(expressSession({
  secret: "not_a_good_idea",
  cookie: {maxAge: 4000000},
  resave: false,
  saveUninitialized: false
}));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

app.set("port", process.env.PORT || 4022);
app.set('view engine', 'ejs');
app.set('token', process.env.TOKEN || 'm34lmak3rt0k3n');

app.use('/', router);

const server = app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
}),
io = require('socket.io')(server);

require('./controllers/chatController')(io);