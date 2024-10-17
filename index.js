require('express-async-errors')

const express = require('express')
const app = express()

require('./startup/routes')(app)
require('./startup/dbconnnection')()
require('./startup/errorHandling')()
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app)
require('./startup/server')(app)
require('./startup/viewEngine')(app)

module.exports = app