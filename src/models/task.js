const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = new mongoose.Schema({ // task schema, Once a schema is defined, Mongoose lets you create a Model based on a specific schema. A Mongoose Model is then mapped to a MongoDB Document via the Model's schema definition.
    description: {
        type: String,                   // model ismini küçük harfe çevirip çoğul hale getirerek colleciton name olarak atar
        required: true,
        trim: true
    }, 
    completed: {
        type: Boolean,
        default: false,
    },
    owner: { // added this filed later in development. This establishes relationship betten user and the task
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' // added to have the relationship with User model,
        // so we can do further query about user. For example, 
        // since we know user id as owner, we ca nfetch user name as well with this ref.
    }
    
}, {
    timestamps : true // with this option added to the schema, as we did in user, task ta da createdat and updated at will be added to the moel in Db
})
const Task = mongoose.model('Task', taskSchema)

// modeli aşağıdaki gibi de oluşturabilirz ancak schema olmadan schema optiona larının sunduğu
// customization dan yararlanamayız. Örneğin schema option a timestamp ekleyebilmek güzel bir özellik,
// ama bunun için task schema mız olması lazım ve sonuna timestamp i true yapmamız lazım aynı user da olduğu gibi
// bu yüzde naşağıdaoluşturduğumuz Task modelinin {} içini yukarıdaki Schema() içine taşıdık ve sonuna önceden burada olmayan timestamps option unu ekledik.
// Böylece DB de tasks içinde createdat ve updateday oto olarak üretilebilecek

/* const Task = mongoose.model('Task', { // model ismini küçük harfe çevirip çoğul hale getirerek colleciton name olarak atar
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
}) */

module.exports = Task