const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('Customer', new mongoose.Schema({
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
}))

function validateInput(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.number().required()
    })
    return schema.validate(customer)
}

module.exports.validate = validateInput
module.exports.Customer = Customer