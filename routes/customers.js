const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const { Customer, validate } = require('../models/customer')

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) return res.status(404).send('No customer found with that ID')

    res.send(customer)
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    await customer.save()
    res.send(customer)
})


router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
        { new: true })
    if (!customer) return res.status(404).send('No customer found with that ID')

    res.send(customer)
})


router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send('No customer found with that ID')
    res.send(customer)
})

module.exports = router