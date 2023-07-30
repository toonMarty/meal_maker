const Course = require('../models/course');

const getCourseParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    maxStudents: body.maxStudents,
    cost: body.cost,
  }
}

module.exports = {
  index: (req, res, next) => {
    Course.find({})
    .then(courses => {
        res.locals.courses = courses;
        next();
    })
    .catch(error => {
      console.log(`Error getting course: ${err.message}`);
      next(error);
    });
  },

  indexView: (req, res) => {
    res.render('courses/index');
  },

  new: (req, res) => {
    res.render('courses/new');
  },

  create: (req, res, next) => {
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams)
    .then(course => {
      res.locals.redirect = '/courses';
      res.locals.course = course;
      next();
    })
    .catch(error => {
      console.log(`Failed to save course: ${error.message}`);
      next(error);
    });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
    .then(course => {
      res.locals.course = course;
      next();
    }).catch(error => {
        console.log(`Couldn't find course: ${error.message}`);
        next(error);
    })
  },

  showView: (req, res, next) => {
    res.render('courses/show');
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
    .then(course => {
      res.render('courses/edit', {course: course});
    })
    .catch(error => {
      console.log(`Error editing course: ${error.message}`);
      next(error);
    });
  },

  update: (req, res, next) => {
    let courseId = req.params.id;
    let courseParams = getCourseParams(req.body);

    Course.findByIdAndUpdate(courseId, { $set: courseParams })
    .then(course => {
      res.locals.redirect = `/courses/${courseId}`;
      res.locals.course = course;
      next();
    })
    .catch(error => {
      console.log(`Error updating course: ${error.message}`);
      next(error);
    });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
    .then(() => {
      res.locals.redirect = '/courses';
      next();
    })
    .catch(error => {
      console.log(`Couldn't update course: ${error.message}`);
    });
  }
}

