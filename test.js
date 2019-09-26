const auth = require('./auth')

async function test(){
    const token = await auth()
    // console.log(token)
}

test()