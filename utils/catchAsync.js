// since the passed function us async function it will automatically return a promise
// a in case the promise is rejected "has error" we can catch this error using .catch()
// in express we can write "(err) => next(err)" as "next" only
// error will be passed automatically to next function

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
