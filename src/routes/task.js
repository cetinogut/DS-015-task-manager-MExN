const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')// added for user authentication
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => { // added auth as a second argument for authentication
    //const task = new Task(req.body) // the version before auth
    const task = new Task({ // updated the lane above to fit for authenticatiın. Now I have added user id as for the owner filed.
        ...req.body, // the task description and completed if provided
        owner: req.user._id // this comes from auth
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET /tasks?completed=false
//GET /tasks?limt=10&skip=0 (first 10 results), /tasks?limt=10&skip=10 (second 10 results)
// /tasks?sortBy=createdAt:desc (or createdAt:asc) (createdAT_asc veya createdAt_desc de olurdu. aradaki (: , _)karaktere göre stringi ayıracağız)
router.get('/tasks', auth, async (req, res) => {

    const match ={} // this is an empty match object. We will fill it acoording t ousers requst if any and the nwill use in the options below.
    const sort = {} // this is an empty sort object. We will fill it acoording t ousers requst if any and the nwill use in the options below.

    if(req.query.completed){ // if completed is provided in query string
        match.completed = req.query.completed === 'true' // if the completed param is provided and is true then match :{true} as commented section below
    }

    if(req.query.sortBy){ // if sortBy is provided in query string
        const parts = req.query.sortBy.split(':') // this is the string provided and we will split it up by the char
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 // getting the first array element in the string and using that as the propert name for sorting
        console
    }
    try {

        // const tasks = await Task.find({}) // find before auth
        //const tasks = await Task.find({ owner : req.user._id}) // filter tasks according to thier owner
        await req.user.populate({ // I changed the populate func with matched option to fetch completed task
            path:'tasks',
            match, // this object ist defined and assigned above
           /*  match: {  this is working manually but we need to put some logic here thay's why used variables and object above.
                completed: true
            } */
            // added the options below for pagination and sorting
            options:{
                //limit:2 this works manually now lets get it fro mthe use below
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                
                /* sort: {
                    createdAt: -1 // -1 for asccending (newest at the top), 1 for descending (oldest at the top)
                } */
                // the above sort value worked manually, below we will make it with the embedde code. Before this stage we have to define the empt object -because user might not be providing any criteria for sort and that time the sort value will be empt
                sort
            }
        }).execPopulate() // this a new solution returning the tasks of a user. Here since iti is finding the tasks dynamically we should not assing tasks to a variable.
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// below is the get route for tasks fetching all tasks belonging to a specific user
/* router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({}) // find before auth
        //const tasks = await Task.find({ owner : req.user._id}) // filter tasks according to thier owner
        await req.user.populate('tasks').execPopulate() // this a new solution returning the tasks of a user. Here since iti is finding the tasks dynamically we should not assing tasks to a variable.
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
}) */


router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id) // this line was working before auth
        const task = await Task.findOne({ _id, owner:req.user._id}) // with auth we also nedd to look at the owner id
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})



router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findById(req.params.id) // the solution before auth
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        /* updates.forEach((update) => {
            user[update] = req.body[update] // burada bracket notation kullanıyoruz çünkü değerler dinamik olarak arrayden geliyor ve . notation kullanamayacağız.
        }) */
        updates.forEach((update) => task[update] = req.body[update]) // yukarının short hand formu
        await task.save() // burada middleware devreye girecek
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id) // solution before auth
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id}) // becareful about findByIdAndDelete.. smth problematic. Use findOneAndDelete insteaad

        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router