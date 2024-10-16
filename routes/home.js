const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', { title: 'My Express', message: 'Welcome to vidly' })
    res.send('Welcome to Vidly')
})


module.exports = router