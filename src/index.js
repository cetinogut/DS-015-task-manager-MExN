const express = require('express'); // server i yükledik
require('./db/mongoose')
//const User = require('./models/user') bunlarda ilgili route dosyasına taşındı artık burada kullanılmayacak
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

app.use(express.json())// json datanın to parse ini sağlayacak
app.use(userRoutes)
app.use(taskRoutes)
app.use(testCoRoute) // bu satır olmadan router.get veya router.post çalışmaz

app.listen(port, () => console.log(`listening on http://localhost:${port}`));