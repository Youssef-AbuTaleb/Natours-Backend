const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less or equal than 40 characters',
      ],
      minLength: [
        10,
        'A tour name must have more or equal than 10 characters',
      ],
    },
    slug: String,
    // duration in days
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // validation only works with new created documents
      // we can use NPM validator package to create custom validation also
      validate: {
        message:
          'Discount price ({VALUE}) should be below the regular price',
        validator(val) {
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 ******************** DOCUMENT MIDDLEWARE *************************** 
 * 
 * We use Schema.pre to run a function before a specific event, such as "save".
 * Inside the pre hook, we have access to the next function and the this context 
     (the document or query being processed).
 * If we use the this keyword, we must define the function using a regular function expression 
     (not an arrow function) to maintain the correct context.
 * We use Schema.post to run a function after an event has occurred.
 * In the post hook, we have access to the created document and the next function.
 * The next() function can be omitted if the middleware for this hook (e.g., "save") is the only one present.
 * If multiple middlewares are registered for the same hook, 
     we must call next() to pass control to the next middleware in the chain.
*/

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

/**************** QUERY MIDDLEWARE ******************/
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });
// tourSchema.post(/^find/, function (_docs, next) {
//   this.end = Date.now();
//   console.log(
//     `Query took  ${Date.now() - this.start} milliseconds`,
//   );
//   next();
// });

/**************** AGGREGATE MIDDLEWARE ******************/

tourSchema.pre('aggregate', function (next) {
  console.log(
    this._pipeline.unshift({
      $match: { secretTour: { $ne: true } },
    }),
  );

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
