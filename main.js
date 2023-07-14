/**App logic */

const express = require('express');
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/meal_maker', {useNewUrlParser: true});

/**Middleware to interpret incoming request bodies */
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layouts);

app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.get('/', homeController.showCourses);
app.get('/contact', homeController.showSignUp);
app.post('/contact', homeController.postedSignUpForm);


app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
