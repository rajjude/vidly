const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
})
const Genre = mongoose.model('Genre', genreSchema)

function validateInput(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })
    return schema.validate(genre)
}
module.exports.genreSchema = genreSchema
module.exports.validate = validateInput
module.exports.Genre = Genre
