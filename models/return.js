const mongoose = require('mongoose')

const Return = mongoose.model('Return', new mongoose.Schema({
    customerId: {
        type: mongoose.Types.ObjectId(),
        required: true
    },
    movieId: {
        type: mongoose.Types.ObjectId(),
        required: true
    }
}))
