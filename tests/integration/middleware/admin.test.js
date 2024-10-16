const admin = require('../../../middleware/admin')

describe('admin middleware', () => {
    it('should return 403 if user in not an admin', () => {
        const req = { user: { isAdmin: false } }
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()

        }
        const next = jest.fn()

        admin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(next).not.toHaveBeenCalled()
    })

    it('should return 403 if user in not an admin', () => {
        const req = { user: { isAdmin: true } }
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()

        }
        const next = jest.fn()

        admin(req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    })
})