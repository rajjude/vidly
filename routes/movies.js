const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const { Movie, validate } = require('../models/movie')
const { Genre } = require('../models/genre')

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name')
    res.send(movies)
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if (!movie) return res.status(404).send('The movie you are searching does not found')

    res.send(movie)
})

router.post('/', async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send('The genre you are searching is not found')

    const movie = new Movie({
        name: req.body.name,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalPrice: req.body.dailyRentalPrice
    })

    await movie.save()

    res.send(movie)
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const movie = await Movie.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })

    if (!movie) return res.status(404).send('The movie you are searching does not found')

    res.send(movie)
})

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)

    if (!movie) return res.status(404).send("The movie you are searching does not found")

    res.send(movie)
})

module.exports = router