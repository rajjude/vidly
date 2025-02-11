const supertest = require('supertest')
const { User } = require('../../../models/user')
const { Genre } = require('../../../models/genre')
const app = require('../../../index')

describe('auth middleware', () => {

    const request = supertest(app)
    let token;
    beforeEach(() => {
        token = new User().generateAuthToken()
    })
    afterEach(() => {
        Genre.deleteMany()
    })


    const exec = () => {
        return request
            .post('/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' })
    }

    it('should return 401 if no token is provided', async () => {
        token = ''
        const res = await exec();
        expect(res.status).toBe(401)
    })

    it('should return 400 if token is invalid', async () => {
        token = 'a'
        const res = await exec();
        expect(res.status).toBe(400)
    })

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200)
    })
})