const moment = require('moment')
const app = require('../../../index')
const supertest = require('supertest')
const { Rental } = require('../../../models/rental')
const { Movie } = require('../../../models/movie')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')
const c = require('config')

describe('/returns', () => {
    const request = supertest(app)

    let rental;
    let customerId;
    let movieId
    let token
    let movie

    const exec = () => {
        return request
            .post('/returns/')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }

    beforeEach(async () => {
        token = new User().generateAuthToken()

        customerId = new mongoose.Types.ObjectId().toHexString()
        movieId = new mongoose.Types.ObjectId().toHexString()

        movie = new Movie({
            _id: movieId,
            name: '12345',
            dailyRentalPrice: 2,
            genre: { name: '12345' },
            numberInStock: 10
        })
        await movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                name: '12345',
                dailyRentalPrice: 2
            }
        })
        await rental.save()
    })

    afterEach(async () => {
        await Rental.deleteMany({})
    })


    it('should return 401 if user is not logged in', async () => {

        token = ''

        const res = await exec()

        expect(res.status).toBe(401)
    })

    it('should return 400 if customer Id is not provided', async () => {

        customerId = ''

        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 400 if movie Id is not provided', async () => {

        movieId = ''

        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 404 if no rental is not found for customer/movie', async () => {

        await Rental.deleteMany({})

        const res = await exec()

        expect(res.status).toBe(404)
    })

    it('should return 400 if rental is already processed', async () => {

        rental.dateReturned = new Date()
        await rental.save()

        const res = await exec()

        expect(res.status).toBe(400)
    })

    it('should return 200 if it is a valid request', async () => {

        const res = await exec()

        expect(res.status).toBe(200)
    })

    it('should set the return date if input is valid', async () => {

        const res = await exec()

        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned

        expect(diff).toBeLessThan(10 * 1000)
    })

    it('should calculate rental fee if input is valid', async () => {

        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()

        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBeDefined()
    })

    it('should update the movie stock once movie is returned', async () => {

        const res = await exec()

        const movie = await Movie.findById(movieId)
        expect(movie.numberInStock).toBe(11)
    })

    it('should return rental object if input is valid', async () => {

        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'movie', 'customer', 'rentalFee']))
    })


})