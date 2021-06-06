const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', { // model ismin iküçük harfe çevirip çoğul hale getirerek colleciton name olarak atar
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task