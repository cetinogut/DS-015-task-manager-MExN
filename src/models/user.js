const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs') // hashing algorithms by design are not reversable.
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true, // check if the user has unique email, this will create an index in MongoDb. Adding this line requires to drop all users and create from the start to have the uniqueness index
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
    },

    tokens: [{ // an array of token to keep track of created tokens
        token: {
            type: String,
            required: true
        }
    }]
    /*,

    role: { // added here to improve the project for role based auth.
        type: String,    
        enum: ['user', 'admin'],    
        required: true,    
        default: 'user'
    }*/
})
//class no 114: now we have task-user relationship. We added a new field in task document for owner who is creating that task. We ca nbring the user using owner (user_id) for a specific task with populate() method.
// but what if we want to bring all tasks about a user. Now we will not approach as we did wity user token. Above in the model we created an array for tokens. But there is no need for tasks.
// we will use a virtual property. virtual property is not an actual data stored in DB. but it is a relation ship between to entities
userSchema.virtual('tasks', { // we will call this function later
    ref:'Task',
    localField: '_id', // one side of the relation is user id located here
    foreignField: 'owner' // the other side of the relation fro mthe other model
})

userSchema.methods.toJSON = function () { // sadece toJSON değişti, func içeriği aslında aşağıdakiyle aynı. aslında bu method ile JSON.stringfy daki gibi istemediğimiz datayı kaldırdık.
    const user = this
    const userObject = user.toObject()

    delete userObject.password // remove sensitive data from object
    delete userObject.tokens // remove sensitive data from object

    return userObject  // now we just return the unsensitive user data and current token for auth.
}

/* userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password // remove sensitive data from object
    delete userObject.tokens // remove sensitive data from object
    return userObject  // now we just return the unsensitive user data and current token for auth.
} */
userSchema.methods.generateAuthToken = async function () {        // creatd for user token, it is an instance method
    const user = this
    const token = jwt.sign( { _id: user._id.toString()}, 'thisismynewcourse') // secret for generating token is here

    user.tokens = user.tokens.concat({ token }) // add new token into the tokens array
    await user.save() // save toke nto the MongoDB

    return token

}
userSchema.statics.findByCredentials = async (email, password) => {  // created for login functionality, this is a model method
    const user = await User.findOne({ email }) // first just look at the user, bacause the password is hashed. If user exists then check the hashed-password

    if (!user) {
        throw new Error('Unable to login') // incorrect user name
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login') // incorrect password
    }

    return user // if match return user
}

// hash the plain text password before saving
userSchema.pre('save', async function (next) { // run a code before a user is saved
    const user = this // we call next() when we are done

    console.log('just before saving the user!!!') // bunun yazdığını gördüğümüzde middleware in consistently runnnig olduğunu anladık şimd iaşağıda hashing yapabiliriz

    if(user.isModified('password')){
        user.password =  await bcrypt.hash(user.password, 8)
    }

    next() // next ile burası bitirlimez ise bu func sürekli çalışır.
})

const User = mongoose.model('User', userSchema ) // this is the user model name that we have to use in other files where we want to reach User model.
// for example in task.js (model) we gave a ref to User. that ref model name should be same as with the name defined in this line.

module.exports = User