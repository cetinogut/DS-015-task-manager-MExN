require('../src/db/mongoose')
const Task = require('../src/models/task')

/* Task.findByIdAndDelete('60ba9c80ebafa96610187980').then((task) => {
    if(!task){
        console.log('no task to delete!!!')
    }
    console.log(task)
    return Task.countDocuments({ completed: false })
}).then((result) => {
    console.log('Incomplete tasks:' + result)
}).catch((e) => {
    console.log(e)
}) */

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('60baa850cfb5a8283468a441').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})