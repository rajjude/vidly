const app = require('../index')
module.exports = function (app) {
    app.set('view engine', 'pug')
    app.set('views', './views')
}