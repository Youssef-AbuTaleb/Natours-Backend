class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4)
      ? 'fail'
      : 'error';
    // operational are errors are those coming from user input, internet cut, wrong route
    // ...etc, but those that are coming from code mistakes are not operational (bugs)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
