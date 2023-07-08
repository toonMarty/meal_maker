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
    title : 'Design Pattern bacon',
    cost  : 800 
  }
  
];

exports.showCourses = (req, res) => {
  res.render('courses', { 
    offeredCourses: courses 
  });
};

exports.showSignUp = (req, res) => {
  res.render('contact');
};

exports.postedSignUpForm = (req, res) => {
  res.render('thanks');
};
