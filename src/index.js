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


/* // added below to test some functionality. (find user given the task_id)
const Task = require('./models/task')

const  testFindUser = async () => {
  const task = await Task.findById('60c72b7f4ab658350cc11c2a') // this is a task id from MongoDb. the id will change if the task deleted. Check it.
  console.log('task objectCo: ' + task) // this returns the task object
  console.log('ownerCo only id: ' + task.owner) // this rteturns the user id associated with the task

  await task.populate('owner').execPopulate() // this line executes a further query based on ref relation in task model and fetches the whole user associated with that task
  console.log('full user Co after populate: ' + task.owner) // now this returns  full user object associated with the task. Because we reached the user with popolate(method)
}

// added below to test some functionality. (find task given the user_id)
const User = require('./models/user')

const  testFindTask = async () => {
  const user = await User.findById('60c7283bdbed303f481c5645') // this is a user id associated with a task
  // now we find the user and we want to rtrieve the tasks on that user. 
  console.log('user before populate: ' + user.tasks) // this will return undefined.
  
  await user.populate('tasks').execPopulate() // this line executes a further query based on ref relation in task model and fetches the whole user associated with that task
  console.log('full tasks Co after populate: ' + user.tasks)
}
//testFindUser() uncomment to see the fwtching of user info based on task id.
testFindTask() */