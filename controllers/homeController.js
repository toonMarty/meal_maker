/*callback functions for specific routes */
let courses = [
  {
    title : 'Asynchronous Muffins',
    cost  : 200
  },

  {
    title : 'Agile Mandelbrot Cookies',
    cost  : 100
  },

  {
    title : 'Domain Driven Danish Pastry',
    cost  : 750
  },

  {
    title : 'Design Pattern Bacon',
    cost  : 800 
  }

];

module.exports = {
  showCourses: (req, res) => {
  res.render('courses', { 
    offeredCourses: courses 
  });
}
}