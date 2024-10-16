const moment = require('moment')
const mongoose = require("mongoose")
const Joi = require('joi')
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                require: true
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minLength: 3,
                maxlength: 255,
                required: true,
                trim: true
            },
            dailyRentalPrice: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}

rentalSchema.methods.return = function () {
    this.dateReturned = new Date()

    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalPrice
}

const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate(rental)
}

module.exports.validate = validateRental
module.exports.Rental = Rental