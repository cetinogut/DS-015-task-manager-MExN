// this is our auth middleware
const jwt = require('jsonwebtoken') // to be able to check token
const User = require('../models/user') // to be able to access to the user info

const auth = async (req, res, next) => {
    try { // validating the token
        console.log('in auth try block...)')
        //const token = req.header('Authorization')
        const token = req.header('Authorization').replace('Bearer ', '') // we are accessing the header info. Get rid of the bearer part 'Bearer ', remove this part. and the specific field in the header we want to reach is Authorization
        console.log('Token from client: ' + token)
       
        const decoded = jwt.verify(token, 'thisismynewcourse') // the token was generated in user.js in models folder.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) // find the user with correct id stored in token and check whether the token still in token list

        if (!user) {// no user
            throw new Error() // go to catch block
        }

        req.token = token // we want to track the specific token that we used for this auth session. 
                            // That's why we added this line. If we have 4 different devices connected with my username and password, 
                            // when I logout I just want to logout for that device Not all devices..
        req.user = user // we add a property on the req so we can reach user without fetching for every query.
        next()
    } catch (e) { // not auth correctly
        res.status(401).send({ error: 'Please authenticate. (sender: auth.js)' })
    }
}

module.exports = auth