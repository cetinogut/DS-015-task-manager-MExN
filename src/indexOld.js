const express = require('express'); // server i yükledik
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRoutes = require('./routes/user')
const taskRoutes = require('./routes/task')


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

// router func kullanımı örnek buradan diğer routes/task ve user dosyalarına aktarıldı
const router = new express.Router() // bu yapıyı başla folder da oluşturarak burayı (index.js) sadeleştireceğiz
router.get('/test', (req, res) => {
    res.send('This is from my other router')
})
app.use(router) // bu satır olmadan router.ger veya router.post çalışmaz

/* app.post('/users', async (req, res) => { // bu post func. içinde return yok. o yüzden bunu async yapmak çok basit . sadece başına async ekle. code behaviour will not change
    console.log(req.body)
    const user = new User(req.body)

    try{
        await user.save() // now we reached the promise. and the rest of the call will work if promise is successfull. if we have error from the promise the catch will work
        res.status(201).send(user)
    } catch (error){
        console.log('Error!', error)
        res.status(400).send(error)
    }

    // user.save().then( () => {  // code block before async/await
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     console.log('Error!', error)
    //     //res.status(400)
    //     //res.send(error)
    //     res.status(400).send(error)
        
    // }) 
    //res.send('testing ...');
});

app.get('/users', async (req, res) => {
    try{
        const users = await User.find({}) // now we reached the promise. and the rest of the call will work if promise is successfull. if we have error from the promise the catch will work
        res.send(users)
    } catch (error){
        console.log('Error!', error)
        res.status(500).send()
    }
    // User.find({}).then((users) => {// code block before async/await
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send() // error when db connection lost
    // })
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    console.log(req.params.id)

    try{
        const user = await User.findById(_id)
        if (!user) { // if there is no user
            console.log('no such user!!!')
            return res.status(404).send()
        }
        res.send(user) // send the user that we are loking for

    } catch (e){
        if(e.name === 'CastError'){ // eğer id geçersiz ise 12 byte değilse 500 dönmesi ndiye eklendi
            return res.status(400).send('Invalid id')
            }
            res.status(500).send()
    }

    // User.findById(_id).then((user) => { // id nin tam 12 byte olması lazım ObjectIdD uzunluğunda yoksa hata veriyor ve 404 yerine 500 dönüyor. 
    //     if (!user) { // if there is no user
    //         console.log('no such user!!!')
    //         return res.status(404).send()
    //     }

    //     res.send(user) // send the user that we are loking for
    // }).catch((e) => { // this is an db connection error
    //     if(e.name === 'CastError'){ // eğer id geçersiz ise 12 byte değilse 500 dönmesi ndiye eklendi
    //         return res.status(400).send('Invalid id')
    //     }
    //     res.status(500).send()
    // })
})

app.patch('/users/:id', async (req, res) => { // id ye göre user update
    const updates = Object.keys(req.body) 
    const allowedUpdates = ['name', 'email', 'password', 'age'] // allowed updates
    // const isValidOperation = updates.every((update)  => {
    //     return allowedUpdates.includes(update) // every yukarıdaki array daki her field için çalışır.
    // }) // short-hand for this arrow function in 3 lines is below
    const isValidOperation = updates.every((update)  => allowedUpdates.includes(update)) // every yukarıdaki array daki her field için çalışır.
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user) {
            return res.status(404).send()
        }

        res.status(202).send(user) // default status 200 Ok idi ben 202-Accepted yaptım
    } catch (e) {
        res.status(400).send(e)
    }
})
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/tasks', async (req, res) => {
    console.log(req.body)
    const task = new Task(req.body)

    try{
        await task.save() // now we reached the promise. and the rest of the call will work if promise is successfull. if we have error from the promise the catch will work
        res.status(201).send(task)
    } catch (error){
        console.log('Error!', error)
        res.status(400).send(error)
    }
    //const task = new Task(req.body)
    // task.save().then( () => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     console.log('Error!', error)
    //     //res.status(400)
    //     //res.send(error)
    //     res.status(400).send(error)
        
    // }) 
});

app.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({}) // now we reached the promise. and the rest of the call will work if promise is successfull. if we have error from the promise the catch will work
        res.send(tasks)
    } catch (error){
        console.log('Error!', error)
        res.status(500).send()
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if (!task) { // if there is no user
            console.log('no such task!!!')
            return res.status(404).send()
        }
        res.send(task) // send the user that we are loking for

    } catch (e){
        if(e.name === 'CastError'){ // eğer id geçersiz ise 12 byte değilse 500 dönmesi ndiye eklendi
            return res.status(400).send('Invalid id')
            }
            res.status(500).send()
    }

    // Task.findById(_id).then((task) => { // promise chaning- one async thing to do
    //     if (!task) {
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     if(e.name === 'CastError'){ // eğer id geçersiz ise 12 byte değilse 500 dönmesi ndiye eklendi
    //         return res.status(400).send('Invalid id')
    //     }
    //     res.status(500).send()
    // })
})

app.patch('/tasks/:id', async (req, res) => { // id ye göre user update
    const updates = Object.keys(req.body) 
    const allowedUpdates = ['description', 'completed'] // allowed updates
    
    const isValidOperation = updates.every((update)  => allowedUpdates.includes(update)) // every yukarıdaki array daki her field için çalışır.
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!task) {
            return res.status(404).send()
        }

        res.status(202).send(task) // default status 200 Ok idi ben 202-Accepted yaptım
    } catch (e) {
        res.status(400).send(e)
    }
})
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}) */

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
