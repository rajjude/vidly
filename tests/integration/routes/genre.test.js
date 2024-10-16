const supertest = require('supertest')
const { Genre } = require('../../../models/genre')
const { User } = require('../../../models/user');
const app = require('../../../index');
const mongoose = require('mongoose');

describe('/genres', () => {
    const request = supertest(app)

    beforeEach(async () => {
        await Genre.deleteMany({})
    })
    afterEach(async () => {
        await Genre.deleteMany({});
    })

    describe('GET /', () => {
        it('should return all genres', async () => {

            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ])
            const res = await request.get('/genres')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
        })

    })

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: "genre1" })
            await genre.save()

            const res = await request.get('/genres/' + genre._id)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })

        it('should return 400 if id is invalid', async () => {

            const res = await request.get('/genres/1')
            expect(res.status).toBe(400)

        })

        it('should return 404 if no genre is found for given id', async () => {
            const id = new mongoose.Types.ObjectId()
            const res = await request.get('/genres/' + id)
            expect(res.status).toBe(404)

        })

    })

    describe('POST /', () => {


        let token
        let name

        const exec = async () => {
            return await request
                .post('/genres')
                .set('x-auth-token', token)
                .send({ name })
        }

        beforeEach(() => {
            token = new User().generateAuthToken(),
                name = 'genre1'
        })
        afterEach(async () => {
            await Genre.deleteMany({})
        })

        it('should return 401 if user is not logged in', async () => {

            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 5 characters', async () => {

            name = '1234'

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is more than 50 characters', async () => {

            name = new Array(52).join('s')

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should save the genre if genre is valid', async () => {

            await exec();

            const genre = await Genre.find({ name: 'genre1' })
            expect(genre).not.toBeNull()
        })

        it('should return the genre if genre is valid', async () => {

            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        })
    })

    describe('PUT /:id', () => {
        let token
        let name
        let genreId

        const exec = async () => {


            return await request
                .put('/genres/' + genreId)
                .set('x-auth-token', token)
                .send({ name })
        }

        beforeEach(async () => {
            token = new User().generateAuthToken(),
                name = 'genre2'
            const genre = new Genre({ name: "genre1" })
            await genre.save()

            genreId = genre._id

        })
        afterEach(async () => {
            await Genre.deleteMany({})
        })


        it('should return 401 if user is not logged in', async () => {

            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 5 characters', async () => {

            name = '1234'

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is more than 50 characters', async () => {

            name = new Array(52).join('s')

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should update the genre if the gerneId is valid', async () => {


            const res = await exec()

            expect(res.status).toBe(200)

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre2')
        })

        it('should return 400 if the genreId is invalid', async () => {

            genreId = '1'

            const res = await exec()

            expect(res.status).toBe(400)

        })

        it('should return 404 if the genre you are searching is not found', async () => {

            genreId = new mongoose.Types.ObjectId().toHexString()

            const res = await exec()

            expect(res.status).toBe(404)

        })

        it('should save the genre if genre is valid', async () => {

            await exec();

            const genre = await Genre.find({ name: 'genre2' })
            expect(genre).not.toBeNull()
        })



    })


    describe('DELETE /:id', () => {

        let token
        let genreId

        const exec = async () => {

            return await request
                .delete('/genres/' + genreId)
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            const genre = new Genre({ name: "genre1" })
            await genre.save()
            genreId = genre._id

            token = new User({ isAdmin: true }).generateAuthToken();
        })
        afterEach(async () => {
            await Genre.deleteMany({})
        })


        it('should return 400 if genreId is invalid', async () => {
            genreId = '1'
            const res = await exec()
            expect(res.status).toBe(400)
            // expect(res.text).toBe('Invalid ID.')
        })

        it('should return 404 if genre is not found for that ID', async () => {

            genreId = new mongoose.Types.ObjectId().toHexString()
            const res = await exec()
            expect(res.status).toBe(404)
        })

        it('should delete and send the genre if genre is found', async () => {

            const res = await exec()
            const genre1 = await Genre.findById(genreId)

            expect(res.status).toBe(200)
            expect(res.body.name).toMatch(/genre/)

            expect(genre1).toBeFalsy()
        })
    })
})