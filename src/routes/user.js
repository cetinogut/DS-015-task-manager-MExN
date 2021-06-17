const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()



// see the use of auth middleware depending on the route specifics
// witout middleware: new request => run route handler
// with middleware: new request => do smth, => run route handler
//
// this a public route for rgitering user.. no auth required here so we don't run auth middleware
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

// login for an existing user ,no outh required here, this is a public route
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //res.send(user) // retured the user
        //res.send( {user, token }) // sending back an object consisting of user and token to the client but we are not keeping track of the token anywhere in the server.. We need to update the user document to keep track of the token data
                    // burada user a ait her bilgiyi -password ve token dahil -- gönderiyoruz ve bu çok sağlıklı değil seçici olmalıyız., bu yüzden getPublicProfile func u çağırıp bilgiler iistediğimiz şekilde düzenleyeceğiz.
        //res.send( {user : user.getPublicProfile(), token }) // we define getPublicProfile func in USer model for user instance, önceden sadece user varken bütün user bilgisi geliyordu, şimdi model deki func a gidip süzüp getirioruz.
        res.send( {user, token })// tekrar ilk başa döndük. çünkü getPublicProfile i her seferinde çağırmaktansa bunu otomatik olarak yapmak istiyoruz. Burası aynen kalırken model de toJson () kullanacağız
                    // aslında express server data göndeririken JSON.sitringfy(data) methodunu çağırır.
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

//TODO : update this part for admin role
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
        if(e.name === 'CastError'){ // eğer id geçersiz ise 12 byte değilse 500 dönmesin diye eklendi
            return res.status(400).send('Invalid id')
            }
            res.status(500).send()
    }
})

router.patch('/users/myself', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age'] // allow update only on these property
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // check if this is an valid update request

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

// route to delete for auth user's own profile
router.delete('/users/myself', auth, async (req, res) => {
    try {
        console.log('before deleteOne...')
        //await req.user.remove() // mongose remove() is used here but deprecated. deleteOne() is better
        await req.user.deleteOne({ _id: req.user._id }); // this change also affects the middleware in user model about deleting user tasks before the user. Since remove is deprecated, I used deleteOne over there as well.
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


// route for uploading user avatar pic
/* const upload = multer({  // this uploads eveything w/o validation
    dest: 'images/avatars' // created this folder under the images manually, if no folder you get a 500 error no such directory
}) */
const upload = multer({ // this uploads with validation
    // at the beginnig we saved data to images/avatar folder but in real app wecan save it there. Heroku-AWS will not allow it. We will save the avatar as binary data and that's why added a new field to user model avatar.
    //dest: 'images/avatars', // destination folder for avatar. For dynamic folder check https://github.com/expressjs/multer/issues/58 or  https://github.com/expressjs/multer/issues/39
    limits: {
        fileSize: 1000000 // filesize 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // image file should be jpg, jpeg or png
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})


router.post('/users/myself/avatar', auth, upload.single('avatar'), async (req, res) => { // we are passing multiple arg to post: 1-path, 2-authenticated users only, 3-upload
    const buffer = await sharp(req.file.buffer).resize({ width:250, height: 250 }).png().toBuffer() // we get the user image uploaded and convert it to png and resize to 250x250 image and put it into buffer
    req.user.avatar = buffer  // user image is saved to its avatar field
    // npm sharp added above in two lines and the line below now is commented out. We use shart to resize and to convert to png 
    //req.user.avatar = req.file.buffer // now after removing dest above, we can reach avatar data via req.file.buffer, then we assign this binary data to user avatar field
    await req.user.save() // since we made chamge to user profile, we have to save it
    res.send()                                                                      // 3-validate and accept upload, 4-send back success message, 5- handle the error messages if occur
}, (error, req, res, next) => {  // if smth goes wrong multer will threw an erro rand the error will be handled with this func
    res.status(400).send({ error: error.message })
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

// dlete user'a avatar
router.delete('/users/myself/avatar', auth, async (req, res) => {
    req.user.avatar = undefined // we have cleared the binary data
    await req.user.save()
    res.send()
})

// user will serve his user avatar
// this  will set a url for user avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id) // finding the user by Id

        if (!user || !user.avatar) { // if no user or if no avatar
            throw new Error()
        }

        //res.set('Content-Type', 'image/jpg') // setting response header.. when we send json Content-Type is automatically set to Appication/jsonwebtoken
        // since we changed the upload image with npm sharp, we converted img to png that's why  we commented the line above as the one below.
        res.set('Content-Type', 'image/png')
        res.send(user.avatar) //this is the user image
    } catch (e) {
        res.status(404).send() // no user
    }
})



module.exports = router