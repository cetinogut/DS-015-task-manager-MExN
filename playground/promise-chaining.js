require('../src/db/mongoose') // we have the db connection
const User = require('../src/models/user') // we have access to the user

/* User.findByIdAndUpdate('60ba983e0008f46b5c1d4ab1', { age: 1 }).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 1 })// # of users whose age is 1
}).then((result) => { // 2. then chaining on the first one
    console.log(result)
}).catch((e) => {
    console.log(e)// handle error on any of those two promises
}) */

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('60ba983e0008f46b5c1d4ab1', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})