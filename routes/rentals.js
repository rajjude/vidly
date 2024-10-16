const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')

const mongoose = require('mongoose')


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateout')
    res.send(rentals)
})

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)

    if (!rental) return res.status(404).send('The ovie you are searching does not found')

    res.send(rental)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(404).send('The customer you are searching is not found')

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(404).send('The movie you are searching is not found')

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock')

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            name: movie.name,
            dailyRentalPrice: movie.dailyRentalPrice
        }
    })
    await rental.save()

    movie.numberInStock--
    movie.save()

    res.send(rental)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const rental = await Rental.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

    if (!rental) return res.status(404).send('The rental you are searching does not found')

    res.send(rental)
})


router.delete('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id)

    if (!rental) return res.status(404).send("The rental you are searching does not found")

    res.send(rental)
})

module.exports = router