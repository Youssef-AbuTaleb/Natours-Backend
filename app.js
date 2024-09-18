const express = require('express');

const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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
  //  if the next function receives an argument, no matter what it is,
  // Express will automatically know that there was an error
  // so it will assume that whatever we pass into next is gonna be an error.
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404,
    ),
  );
});

// by defining 4 parameters express automatically know that it's
// the error handling middleware callback
app.use(globalErrorHandler);

module.exports = app;
