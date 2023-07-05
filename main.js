/**App logic */

const express = require('express');
const app = express();

/**Middleware to interpret incoming request bodies */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("port", process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Willkommen bei Meal Maker');
});

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});