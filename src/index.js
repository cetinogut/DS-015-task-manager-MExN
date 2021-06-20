const express = require('express'); // express server package is loaded here
require('./db/mongoose')
//const User = require('./models/user') after separating the routes to folder we have moved them to the related folder
//const Task = require('./models/task')
const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/task')
const testCoRoute = require('./routes/testCo')


const app = express(); // now the express server is up and running
//const port = process.env.PORT || 3000;
const port = process.env.PORT; // bu heroku daki port olacak. localde 3000 de çalışıyordu yukarıdaki gib. fakat config/dev.env içine localhost portunu girdik.

//const www = process.env.WWW || './';
//app.use(express.static(www));
//console.log(`serving ${www}`);

/* app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
}); */


app.use(express.json())// this will parse the json data
app.use(userRoutes) // I've imported userRoutes and taskRoutes at the beginnig of the file
app.use(taskRoutes)
app.use(testCoRoute) // we set all routes in a different folder. Now it is time to use those routes here. Without this line we will not be able to reach the routes we have created

app.listen(port, () => console.log(`listening on http://localhost:${port}`));


