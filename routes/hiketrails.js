const express = require('express');
const {getHikeTrails, getHikeTrailsInRadius, getHikeTrail, createHikeTrail, updateHikeTrail, deleteHikeTrail} = require('../controllers/hiketrails')
const Hiketrails = require('../models/Hiketrails');

const router = express.Router(); 

const advancedResults = require('../middleware/advancedResults'); 

router.route('/radius/:zipcode/:distance').get(getHikeTrailsInRadius); 

router
    .route('/')
        .get(advancedResults(Hiketrails), getHikeTrails)
        .post(createHikeTrail); 

router
    .route('/:id')
        .get(getHikeTrail)
        .put(updateHikeTrail)
        .delete(deleteHikeTrail); 

module.exports = router; 