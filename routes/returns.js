const Joi = require('joi')
const validation = require('../middleware/validation')
const objectId = require('joi-objectid')(Joi)
const express = require('express')
const moment = require('moment')
const { Movie } = require('../models/movie')
const router = express.Router()
const auth = require('../middleware/auth')
const { Rental } = require('../models/rental')

router.post('/', [validation(validateReturn), auth], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('Rental does not found for that customer.')

    if (rental.dateReturned) return res.status(400).send('Return already processed')

    rental.return()
    await rental.save()

    await Movie.findByIdAndUpdate({ _id: req.body.movieId }, { $inc: { numberInStock: 1 } })

    return res.send(rental)
})

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate(req)
}

module.exports = router