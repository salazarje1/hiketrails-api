const mongoose = require('mongoose'); 
const slugify = require('slugify'); 
const geocoder = require('../utils/geocoder');

mongoose.set('strictQuery', true); 

const HiketrailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true, 
        maxLength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String, 
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    hikeLength: {
        type: String,
        maxlength: [10, 'Please enter 10 characters or less']
    }, 
    highestPoint: {
        type: String, 
        maxlength: [10, 'Please enter 10 characters or less']
    },
    elevationGain: {
        type: String, 
        maxlength: [10, 'Please enter 10 characters or less']
    }
    , 
    coordinates: {
        type: String,
        required: [true, 'Please add location coordinates']
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }, 
        coordinates: {
            type: [Number], 
            required: true,
            index: '2dsphere'
        }, 
        city: String,
        stateCode: String,
        countryCode: String,
        zipcode: String,
        formattedAddress: String
    }, 
    area: {
        type: String
    }, 
    entryFee: {
        type: Boolean
    },
    permitRequired: {
        type: Boolean
    }, 
    photo: {
        type: String, 
        default: 'no-photo.jpg'
    }, 
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

HiketrailSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true }); 
    next(); 
})

HiketrailSchema.pre('validate', async function(next){
    let addr = this.coordinates.split(',');
    // addr = {lon: parseFloat(addr[1]), lat: parseFloat(addr[0])};
    const loc = await geocoder.reverse({ lat: addr[0], lon: addr[1] }); 

    this.location = {
        type: 'Point', 
        coordinates: [loc[0].longitude, loc[0].latitude],
        city: loc[0].city,
        stateCode: loc[0].stateCode,
        countryCode: loc[0].countryCode,
        zipcode: loc[0].zipcode,
        formattedAddress: loc[0].formattedAddress
    }

    this.geometry = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude]
    }
    next(); 
})

module.exports = mongoose.model('Hiketrail', HiketrailSchema); 