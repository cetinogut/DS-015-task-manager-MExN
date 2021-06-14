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
    },
    owner: { // added this filed later in development. This establishes relationship betten user and the task
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' // added to have the relationship with User model,
        // so we can do further query about user. For example, 
        // since we know user id as owner, we ca nfetch user name as well with this ref.
    }
})

module.exports = Task