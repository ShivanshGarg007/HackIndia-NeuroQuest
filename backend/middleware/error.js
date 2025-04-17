const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } 
  // Production error response
  else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    else {
      // Log error for debugging
      console.error('ERROR 💥', err);
      
      // Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

// Handle specific types of errors
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new Error(message);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new Error(message);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new Error(message);
};

const handleJWTError = () => {
  return new Error('Invalid token. Please log in again!');
};

const handleJWTExpiredError = () => {
  return new Error('Your token has expired! Please log in again.');
};

// Export the error handler
module.exports = errorHandler;
