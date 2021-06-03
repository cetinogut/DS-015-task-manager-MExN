// CRUD

// const mongodb = require('mongodb')  // bu mongodb native driverdir
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
// yukarıdaki üç satırı destructuring ile aşağıdaki gibi yapabiliriz:

const { MongoClient, ObjectID } = require('mongodb')  // bu mongodb native driverdir

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-managerCo'

const id = new ObjectID() // this a func that creates ID for us
// console.log(id) // bu id nin string halidir
// console.log(id.id) // bu id nin binary halidir.
// console.log(id.id.length) // bu id nin binary halinini uzunluğudur. 12 byte dir
// console.log(id.toHexString) // bu id nin string e çevrilmeisidr halidir.
// console.log(id.toHexString().length) // bu da 24 byte dir
console.log(id.getTimestamp())


MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error){
        return console.log('unable to connect to the database!!!')
    }

    console.log('Connected correctly...') // if no error occurs this message mean a good connection

    const db = client.db(databaseName) // this automatically creates the database

    //DELETE deleteOne, deleteMany
    /* db.collection('users').deleteMany({
        age: 32 // age 32 olanı bul ve sil
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    }) */

    // delete chalange
    db.collection('tasks').deleteOne({
        "description" : "Telefon edilecek" // desc bu olanı bul ve sil
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })

    //UPDATE updateOne, updateMany
   /* const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("60b89059a5340d4018d7c0f2")
    }, {
        $set: {
            name: 'Hogut'
        }
    }) // burada callback çağırmadığımızdan default olarak promise döner . O yüzden bunu promide olara adlandırdık

    updatePromise.then( (result) => { // promise fulfilled we can access to result
        console.log(result)
    }). catch( (error) => { //promise rejected we ca naccess to error
        console.log(error)
    }) */
    // yukarıdaki iki fonk u birleiştirebiliriz aşağıdaki gibi
    /* db.collection('users').updateOne({
        _id: new ObjectID("60b89059a5340d4018d7c0f2")
    }, {
        $set: {
            name: 'Dogut'
        }
    }).then( (result) => { // promise fulfilled we can access to result
        console.log(result)
    }). catch( (error) => { //promise rejected we ca naccess to error
        console.log(error)
    }) // this is async javascript very common promise pattern

    db.collection('users').updateOne({
        _id: new ObjectID("60b89059a5340d4018d7c0f2")
    }, {
        $inc: {
            //age: 2 //increment by 2
            age:-20 // decrement by 20
        }
    }).then( (result) => { // promise fulfilled we can access to result
        console.log(result)
    }). catch( (error) => { //promise rejected we ca naccess to error
        console.log(error)
    }) */

    //challange
    /* db.collection('tasks').updateMany( {
        completed: false // find docs where completed are false
     }, {
            $set:{
                completed:true // bulduklarında completed i true yap
            }
    }).then((result) => {
        console.log(result.modifiedCount)
    }).catch((error) => {
        console.log(error)
    }) */

    // challange conditional update
    /* db.collection('users').updateMany( {
        age: {$lt: 40}  // find docs where age less than 40
     }, {
            $set:{
                age:42 // bulduklarında update age to 42
            }
    }).then((result) => {
        console.log(result.modifiedCount)
    }).catch((error) => {
        console.log(error)
    }) */
    

// //READ
// db.collection('users').findOne( { name: 'Sogut'}, (error, user) => { // user bizim verdiğimiz bir ad
//     if(error){
//         return console.log('unable to fetch the user')
//     }

//     console.log(user)
// })

// db.collection('users').findOne( { name: 'Sogut', age:1}, (error, user) => { // burada 1 yaşında Sogut yok, hata bönemz null döner
//     if(error){
//         return console.log('unable to fetch the user')
//     }

//     console.log(user)
// })

// db.collection('users').findOne( { _id:"60b909b92936a9442c6b6e10" }, (error, user) => { // _id string değil binary dir. string olarak girersek null döner
//     if(error){
//         return console.log('unable to fetch the user')
//     }

//     console.log(user)
// })

// db.collection('users').findOne( { _id:new ObjectID("60b909b92936a9442c6b6e10") }, (error, user) => { // _id string değil binary dir. string olarak girersek null döner
//     if(error){
//         return console.log('unable to fetch the user')
//     }

//     console.log(user)
// })

// db.collection('users').find({ age: 50 }).toArray((error, users) => { // returns a cursor, a pointer to data, can use toArrat or Count
//     if(error){                                                              // users i kendimiz isimlendirdik
//         return console.log('unable to fetch the users')
//     }

//     console.log(users)
// }) 

// // find methodu cursor döner ToArray ile asıl objeler dönerken count da sadece obje sayısı döner ve vertabanı ve connection boşuna yorulmaz

// db.collection('users').find({ age: 50 }).count((error, countOfUsers) => { // returns a cursor, a pointer to data, can use toArrat or Count
//     if(error){                                                               // countOfUsers i kendimiz isimlendirdik
//         return console.log('unable to fetch the users')
//     }

//     console.log(countOfUsers)
// }) // returns a cursor, a pointer to data, can use toArrat or Count

// db.collection('tasks').findOne( { _id:new ObjectID("60b894dad770635f2426b397") }, (error, task) => { // _id string değil binary dir. string olarak girersek null döner
//     if(error){
//         return console.log('unable to fetch the task')
//     }

//     console.log(task)
// })

// db.collection('tasks').find({ completed: false }).toArray((error, completedTasks) => { // returns a cursor, a pointer to data, can use toArrat or Count
//     if(error){                                                              // completedTasks i kendimiz isimlendirdik
//         return console.log('unable to fetch the tasks')
//     }

//     console.log(completedTasks)
// }) 


//CREATE
    //insert a document into a colleciton
    /* db.collection('users').insertOne({
        //_id: id, // yukarıda kendi oluşturduğumuz unique id yi atayacağız
        name: 'Sogut',
        age: 48
    }, (error, result) => { // this is a callback func when the insertion result

        if(error){
            return console.log('Unable to insert user')
        }

        console.log(result.ops) // writng the console the array of documents - here is just one document

    }) */

    //insert many documents into a colleciton
  /*   db.collection('users').insertMany([
        {
            name: 'Murat',
            age: 34
        },
        {
            name: 'Çağrı',
            age: 46
        }
    ], (error, result) => { // callback function
        if(error){
            return console.log('Unable to insert users')
        }

        console.log(result.ops) // writng the console the array of documents - here is just one document
    }) */

        //insert many documents into a task colleciton
    /* db.collection('tasks').insertMany([
        {
            description: 'Alışveriş yapılacak',
            completed: true
        },
        {
            description: 'Telefon edilecek',
            completed: false
        },
        {
            description: 'Yazı yazılacak',
            completed: true
        }
    ], (error, result) => { // callback function
        if(error){
            return console.log('Unable to insert tasks')
        }

        console.log(result.ops) // writng the console the array of documents - here is just one document
    }) */
})