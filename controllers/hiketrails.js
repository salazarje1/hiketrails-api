const Hiketrail = require('../models/Hiketrails'); 
const geocoder = require('../utils/geocoder');

// @desc        Get All hiketrails
// @route       GET /api/v1/hiketrails
// @access      Public
exports.getHikeTrails = async (req, res, next) => {
    try {
        // const hiketrails = await Hiketrail.find(); 

        // return res.status(200).json({ success: true, count: hiketrails.length, data: hiketrails }); 
        return res.status(200).json(res.advancedResults); 
    } catch(err) {
        return res.status(400).json({ success: false }); 
    }
}

// @desc        Get hiketrails within a radius
// @route       GET /api/v1/hiketrails/radius/:zipcode/:distance
// @access      Private
exports.getHikeTrailsInRadius = async(req, res, next) => {
    try {
        const { zipcode, distance } = req.params; 

        // Get lat/long from geocoder
        const loc = await geocoder.geocode(zipcode); 
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;
    
        // Get radius
        const radius = distance / 3963;
        const hiketrails = await Hiketrail.find({
            location: {
                $geoWithin: {$centerSphere: [[lng, lat], radius]}
            }
        })
    
        return res.status(200).json({
            success: true, 
            count: hiketrails.length,
            data: hiketrails
        })
    } catch(err){
        console.log(err); 
        return res.status(400).json({ success: false, error: err }); 
    }
}

// @desc        Get Single hiketrails
// @route       GET /api/v1/hiketrails/:id
// @access      Public
exports.getHikeTrail = async (req, res, next) => {
    const id = req.params.id; 
    try {
        const hiketrail = await Hiketrail.findById(id); 

        if(!hiketrail){
            return res.status(400).json({ success: false }); 
        }

        return res.status(200).json({ success: true, data: hiketrail }); 
    } catch(err) {
        return res.status(400).json({ success: false });
    }
}

// @desc        Create Hike Trail
// @route       POST /api/v1/hiketrails
// @access      Private
exports.createHikeTrail = async (req, res, next) => {
    try{
        const hiketrail = await Hiketrail.create(req.body); 

        return res.status(201).json({ success: true, data: hiketrail }); 
    } catch(err) {
        return res.status(400).json({ success: false, error: err });
    }
}

// @desc        Update Hike Trail 
// @route       PUT /api/v1/hiketrails/:id
// @access      Private
exports.updateHikeTrail = async (req, res, next) => {
    const id = req.params.id; 
    try {
        const hiketrail = await Hiketrail.findByIdAndUpdate(id, req.body, {
            new: true, 
            runValidators: true
        });

        if(!hiketrail){
            return res.status(400).json({ succes: false });
        }

        return res.status(200).json({ success: true, data: hiketrail }); 
    } catch(err) {
        return res.status(400).json({ success: false });
    }
}

// @desc        Delete Single hiketrails
// @route       DELETE /api/v1/hiketrails/:id
// @access      Private
exports.deleteHikeTrail = async (req, res, next) => {
    const id = req.params.id; 
    try {
        const hiketrail = await Hiketrail.findByIdAndDelete(id); 

        if(!hiketrail){
            return res.status(400).json({ success: false }); 
        }

        return res.status(200).json({ success: true, data: {} }); 
    } catch(err) {
        return res.status(400).json({ success: false });
    }
}