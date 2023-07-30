const httpStatus = require('http-status-codes');

module.exports = {
  pageNotFoundError: (req, res) => {
    let resourceNotFound = httpStatus.StatusCodes.NOT_FOUND;
    res.status(resourceNotFound);
    res.render('error');
  },

  internalServerError: (err, req, res, next) => {
    let serverError = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    console.log(`Error occurred: ${err.stack}`);
    res.status(serverError);
    res.send(`${serverError} | It's not you, It's us`);
  }
}