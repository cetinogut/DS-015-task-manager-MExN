const express = require('express'); // server i yükledik
require('./db/mongoose')
//const User = require('./models/user') bunlar da ilgili route dosyasına taşındı artık burada kullanılmayacak
//const Task = require('./models/task')
const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/task')
const testCoRoute = require('./routes/testCo')


const app = express(); // server i çalıştırdık
const port = process.env.PORT || 3000;

//const www = process.env.WWW || './';
//app.use(express.static(www));
//console.log(`serving ${www}`);

/* app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
}); */

//app.use( (req, res, next) => {
  //console.log('writing in index.js : ' + req.method, req.path)
  //next() // to have the route handler to run we have to call the next() func here in the middleware

  /* if( req.method === 'GET'){ // if the client sends a GET request return the follawing message, other wise if ti is sending  a request other than GET than respond it with normal route handler.
    res.send('GET requests are disable')
  } else {
    next()
  } */
//})

/* app.use( (req, res, next) => { // this can be used as a maintanenca middleware
  res.status(503).send('Our server is down currentl') // challenge  for  not responding server for maintanence message
}) */

app.use(express.json())// json datanın to parse ini sağlayacak
app.use(userRoutes)
app.use(taskRoutes)
app.use(testCoRoute) // bu satır olmadan router.get veya router.post çalışmaz

//
// witout middleware: new request => run route handler
//
//  with middleware: new request => do smth, => run route handler
//


app.listen(port, () => console.log(`listening on http://localhost:${port}`));




// to test some function

const bcrypt = require('bcryptjs') // hashing algorithms by design are not reversable. 
//Encryption is different. Hashing algorithms compare two hashed values.

const myFunction = async () => {
    const password = '251609Hc/*'
    const hashedPassword = await bcrypt.hash(password, 8) // it will hash 8 times

     console.log(password)
     console.log(hashedPassword)

     const isMatch =  await bcrypt.compare(('251609Hc/* ').trim(), hashedPassword) //Hashing algorithms compare two hashed values.
     console.log(isMatch)
}

const jwt = require('jsonwebtoken')

const myFunctionJWT = async() => {

const token = jwt.sign( {_id:'abc123'}, 'thisismynewcourse', {expiresIn: '7 days'} )  // to test the expiration so set it to 0 sec
console.log('JWT Token: ' + token)

// get the decoded payload ignoring signature, no secretOrPrivateKey needed
var decoded = jwt.decode(token);
 
// get the decoded payload and header
var decoded = jwt.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload)


const data = jwt.verify(token, 'thisismynewcourse')
/* jwt.verify(token, 'thisismynewcourse', (err, decoded) => {
    if (err) {
      
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      
    }
  }) */

  console.log('Token verified :' + data._id)

 }
 //myFunction()
 myFunctionJWT()
