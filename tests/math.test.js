const { calculateTip, celsiusToFahrenheit, fahrenheitToCelsius, add } = require('../src/math')


// test('Hello World!', () =>{// jest provides test func as a global one. call test() in your test suit to run a test

// }) 

// test( 'This should fail', () => {
//     throw new Error('Failure!!!')
// })

// test('Should calculate total with tip', () => {

//     const total = calculateTip(10, .3)
//     if(total !== 13){
//         throw new Error('total tip should be 13. Got ' + total + ' instead...')
//     }

// })

// test('Should calculate total with tip', () => {
//     const total = calculateTip(10, .3)
//     expect(total).toBe(13)  // toBE checks for equality, use of "expect" library in jest docs
//     // if 13 no error. otherwise throws an error which means that smth wrong in your calculation for the code
// })

// test('Should calculate total with default tip', () => { // this is to check default tip amount
//     const total = calculateTip(10)
//     expect(total).toBe(12.5)
// })

// test('Should convert 32 F to 0 C', () => { // this is to check F --> C
//     const conversion = fahrenheitToCelsius(32)
//     expect(conversion).toBe(0)
// })

// test('Should convert 0 C to 32 F', () => { // this is to check C --> F
//     const conversion = celsiusToFahrenheit(0)
//     expect(conversion).toBe(32)
// })

// test('Async test demo', (done) => { // call done after settimeout (call done when you are done)
//     setTimeout( () => {
//         expect(1).toBe(2)
//         done() // jest have to wait the async process to finish before making a judgement for test. other wise without waiting jest is throwing a success without event testing
//     }, 2000)
   
// })

// promised based async function
test('Should add two numbers', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5) // we make the assertion and we call done
        done() // our assertion is in place and async func is finished.
    })
})

// async/await test  --> this usage is more common because the syntax is readable.
test('Should add two numbers async/await', async() => {
    const sum = await add(12,21)
    expect(sum).toBe(33)
})
