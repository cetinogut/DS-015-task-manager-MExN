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

    role: {    
        type: String,    
        enum: ['user', 'admin'],    
        required: true,    
        default: 'user'
    }*/
})
userSchema.methods.toJSON = function () { // sadece toJSON değişti, func içeri aslında aşağıdakiyle aynı. aslında bu method ile JSON.stringfy daki gibi istemediğimiz datayı kaldırdık.
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

const User = mongoose.model('User', userSchema )

module.exports = User