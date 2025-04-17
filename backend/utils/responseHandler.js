class ResponseHandler {
  static success(res, data, statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  static error(res, message, statusCode = 400) {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  }
}

module.exports = ResponseHandler;
