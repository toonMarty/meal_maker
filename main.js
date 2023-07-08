/**App logic */

const express = require('express');
const homeController = require('./controllers/homeController');
const layouts = require('express-ejs-layouts');
const app = express();

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