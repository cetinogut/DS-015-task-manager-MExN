const express = require('express'); // express server package is loaded here
require('./db/mongoose')
//const User = require('./models/user') after separating the routes to folder we have moved them to the related folder
//const Task = require('./models/task')
const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/task')
const testCoRoute = require('./routes/testCo')


const app = express(); // now the express server is up and running
const port = process.env.PORT || 3000;

//const www = process.env.WWW || './';
//app.use(express.static(www));
//console.log(`serving ${www}`);

/* app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
}); */

// this is a test func for uploading data to the server using multer nmp package
const multer = require('multer')
const upload = multer( { //  now getting a new intance of multer. We may need to reconfigure multer instance depending on the file we want to upload in different parts of the app.
  dest: 'images', // this is the folder I have created manually/ end point we want to upload the files. Since we want to upload images we called it images. 
  limits:{
    fileSize: 1000000 // 1 MB - this limit file uploads to 1 MB
  }, 
  fileFilter( req, file , cb ){ // file is info about the file, file name is located in that part too, cb is callback funcg whe nwe're done with filtering the file
    if(
       (!file.originalname.endsWith('.pdf')) &&  // if not pdf or if not doc return an error, this is a manual
       //(!file.originalname.endsWith('.doc')) // if not doc 
       (!file.originalname.match(/\.(doc|docx)$/)) // this is a regex for doc or docx fro mregex101.com
       ){
      return cb(new Error('file must be a PDF or wordDoc. please upload a doc in proper format'))  // user triying to upload a different file type only pdfs are accepted
    }

    
    cb(undefined, true) // no errors, upload is true, the fle will be stored in the images directory because we set it like that i
    // cb(undefined, false) // no error, uplad false
  }

}) // Infact this is a new end-point. the generic route end-point is below for testing.

app.post('/upload', upload.single('upload'), (req, res) => { // upload.single() is the multer middleware we we will get support for uploading one file. We gave the name 'upload' to our upload event
  res.send()
}, (error, req, res, next) => {  // if smth goes wrong multer will threw an erro rand the error will be handled with this func
  res.status(400).send({ error: error.message })
})  // in this way we have uploaded an image to the images folder with the key word upload. Currently it does not provide the file extension. We do it later.

app.use(express.json())// this will parse the json data
app.use(userRoutes) // I've imported userRoutes and taskRoutes at the beginnig of the file
app.use(taskRoutes)
app.use(testCoRoute) // we set all routes in a different folder. Now it is time to use those routes here. Without this line we will not be able to reach the routes we have created

app.listen(port, () => console.log(`listening on http://localhost:${port}`));


