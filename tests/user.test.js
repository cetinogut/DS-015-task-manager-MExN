const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name : 'John Doe',
    email : 'john@google.com',
    password : '251609Hc/*'
};

beforeEach( async () => { // runs before each test 
    console.log('before each :')
    await User.deleteMany(); // deletes all users then runs the test below
    await new User(userOne).save(); 
})

/* afterEach(() => {
    console.log('after each :')
}) */

//test case-1
test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name : 'cogutTest', 
        email : 'cogutTest@gmail.com', 
        password : '251609Hc/*'
    }).expect(201)
})

//test case-2
test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email, 
        password : userOne.password
    }).expect(200)
})

// test case-3
test('Should not login a non-existing user', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email, 
        password : 'thisisnotrealpassword'
    }).expect(400)
})