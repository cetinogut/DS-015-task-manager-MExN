const express = require('express'); // server i yükledik
require('./db/mongoose')
const User = require('./models/user')


const app = express(); // server i çalıştırdık
const port = process.env.PORT || 3000;

//const www = process.env.WWW || './';
//app.use(express.static(www));
//console.log(`serving ${www}`);

/* app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
}); */

app.use(express.json())// json datanın to parse ini sağlayacak

app.post('/users', (req, res) => {
    console.log(req.body)

    const user = new User(req.body)

    user.save().then( () => {
        res.send(user)
    }).catch((error) => {
        console.log('Error!', error)
        //res.status(400)
        //res.send(error)
        res.status(400).send(error)
        
    }) 

    //res.send('testing ...');
});


app.listen(port, () => console.log(`listening on http://localhost:${port}`));
