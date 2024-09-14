const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
// 2) ROUTE HANDLERS
const getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    // const queryObject = { ...req.query };
    // const execludedFields = [
    //   'page',
    //   'sort',
    //   'limit',
    //   'fields',
    // ];
    // execludedFields.forEach((el) => delete queryObject[el]);
    // // 1B) Advanced Filtering
    // let queryString = JSON.stringify(queryObject);
    // queryString = queryString.replace(
    //   /\b(lt|lte|gt|gte|eq)\b/g,
    //   (match) => `$${match}`,
    // );
    // let query = Tour.find(JSON.parse(queryString));

    // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   //default sorting
    //   query = query.sort('-createdAt');
    // }

    // 3) Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // 4) Pagination
    // const page = +req.query.page || 1;
    // const limit = +req.query.limit || 100;
    // const skip = (page - 1) * limit;

    // query = query.limit(limit).skip(skip);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (numTours <= skip)
    //     throw new Error('This page does not exist');
    // }
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('diffuclty')
    //   .equals('easy');

    // SEND QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage price';
  req.query.fields =
    'name price ratingsAverage summary difficulty';

  next();
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
};
