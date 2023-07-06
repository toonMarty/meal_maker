/*callback functions for specific routes */
exports.showCourses = (req, res) => {
  res.render('courses');
};

exports.showSignUp = (req, res) => {
  res.render('contact');
};

exports.postedSignUpForm = (req, res) => {
  res.render('thanks');
};