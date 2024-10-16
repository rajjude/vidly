const mongoose = require('mongoose')
const Joi = require('joi')
const { genreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxlength: 255,
        required: true,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
    ,
    dailyRentalPrice: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})
const Movie = mongoose.model('Movie', movieSchema)

function validateInput(movie) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalPrice: Joi.number().min(0).required()
    })
    return schema.validate(movie)
}

module.exports.validate = validateInput
module.exports.Movie = Movie