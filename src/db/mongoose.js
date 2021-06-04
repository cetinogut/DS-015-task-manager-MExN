const mongoose = require('mongoose')
//const validator = require('validator') modellere taşıdık

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-apiCo', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})

/* const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!!!')
            }
        }

    },
    age: {
        type: Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number') // bu hata console da görünür
            }
        }
    },
    password: {
        type: String,
        required:true,
        trim: true,
        minLength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your password cannot contain "password" !!!')
            }
        }
    }
}) */

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

 /* const me = new User({
    name: 'Dogan',
    email : 'dogan@gmail.COM  ',
    password: 'dogan2007!!'
})

me.save().then( () => {
    console.log(me)
}).catch((error) => {
    console.log('Error!', error)
}) 
 */
/*     const taskFirst = new Task({
    description: 'Markete gidilecek',
    //completed: true
})

taskFirst.save().then( () => {
    console.log(taskFirst)
}).catch((error) => {
    console.log('Error!', error)
})   */