const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()

        const token = await user.generateAuthToken()  // after the user is saved create a token

        //res.status(201).send(user)
        res.status(201).send({user, token}) // sending back user and token created
    } catch (e) {
        res.status(400).send(e)
    }
})

// login for an existing user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //res.send(user) // retured the user
        //res.send( {user, token }) // sending back an object consisting of user and token to the client but we are not keeping track of the token anywhere in the server.. We nned to update the user document to keep track of the token data
                    // burada user a ait her bilgiyi -password ve token dahil -- gönderiyoruz ve bu çok sağlıklı değil seçici olmalıyız., bu yüzden getPublicProfile func u çağırıp bilgiler iistediğimiz şekilde düzenleyeceğiz.
        //res.send( {user : user.getPublicProfile(), token }) // we define getPublicProfile func in USer model for user instance, öncede nsadece user varken bütün user bilgisi geliyordu, şimd imodel deki func a gidip süzüp getirioruz.
        res.send( {user, token })// tekrar ilk başa döndük. çünkü getPublicProfile i her seferinde çağırmaktansa bunu otomatik olarak yapmak istiyoruz. Burası aynne kalırken model de toJson () kullanacağız
                    // aslında express server data göndeririken JSON.sitringfy(data) methodunu çağırı.
    } catch (e) {
        res.status(400).send() // logimng in did not worked
    }
})
//user logout route handler one specific device
router.post('/users/logout', auth, async (req, res) => { // to logout yo uhave to be auth.
    try {
        req.user.tokens = req.user.tokens.filter((token) => { // we need to remove the current token from the tokens list.
            return token.token !== req.token // we iterate throught token, till finding the current token.
        })
        await req.user.save()

        res.send() // send back 200 with logout.
    } catch (e) {
        res.status(500).send()
    }
})

// user logout from all devices
router.post('/users/logoutAll', auth, async (req, res) => { //all sessions will be finalized
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// added second argument of auth to have auth middleware
router.get('/users', auth, async (req, res) => { // bu route da auth middleware nin çalışmasını istiyoruz, auth middleware çalışıp, kendi içindeki next func çağırınca buradaki async func çalışıp route handling işini yapabilecek. 
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
}) // this is my test and dev route for getting users. But at the real app the user (unless admin) wil not need to see all users. The user needs only his/her profile. For this reason I created the following route for user Profile


// this is for allowing user to see his/her profile
router.get('/users/myself', auth, async (req, res) => { // bu route da auth middleware nin çalışmasını istiyoruz, auth middleware çalışıp, kendi içindeki next func çağırınca buradaki async func çalışıp route handling işini yapabilecek. 
    res.send(req.user) // this func will only run if user is authicantated. No need for error handling here.
}) 


// aslında bu user getbyId normal userler için gerekmiyor. Admin için gerekli sadece. O yüzden bunu auth yapmadan kaldırdı programda. benim duruyor 
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

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
})

// // bu admin için update olabilir. user kendisini update edecekse aşağıdaki ni kullandım
// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {  // findbyIdand Update skips the mongoose and directly work with DB. to prevent this behaviour,
//         const user = await User.findById(req.params.id)

//         /* updates.forEach((update) => {
//             user[update] = req.body[update] // burada bracket notation kullanıyoruz çünkü değerler dinamik olarak arrayden geliyor ve . notation kullanamayacağız.
//         }) */
//         updates.forEach((update) => user[update] = req.body[update]) // yukarının short hand formu
//         await user.save() // burada middleware devreye girecek
        
//         //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })// bunu yorum yapıp yukarıyı ekledik. Mongoose da update işlemi çalışsın diye..

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

router.patch('/users/myself', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


//this is delete without auth. Can be used as an admin delete later
router.delete('/users/:id', async (req, res) => {
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


router.delete('/users/myself', auth, async (req, res) => {
    try {
        console.log('before deleteOne...')
        await req.user.remove() // mongose remove() is used here but deprecated. deleteOne() is better
        //await req.user.deleteOne({ _id: req.user._id });
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router