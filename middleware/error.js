// this function only catches error in the req processing pipeline
module.exports = function error(err, req, res, next) {
  // logging levels:
  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  console.log('error', err.message, err);

  res.status(500).send('Something failed.');
};
