const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = tourController;

// this middleware will only executed for requests that hits tours/:id
// router.param('id', checkId);
router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
