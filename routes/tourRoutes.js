const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} = tourController;

// this middleware will only executed for requests that hits tours/:id
router.param('id', checkId);

router
  .route('/')
  .get(getAllTours)
  .post(checkBody, createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
