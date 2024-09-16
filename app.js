const express = require('express');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDLLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  const err = new Error(
    `Can't find ${req.originalUrl} on this server!`,
  );
  err.status = 'fail';
  err.statusCode = 404;
  //  if the next function receives an argument, no matter what it is,
  // Express will automatically know that there was an error
  // so it will assume that whatever we pass into next is gonna be an error.
  next(err);
});

// by defining 4 parameters express automatically know that it's
// the error handling middleware callback
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
