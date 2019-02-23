const express = require('express');
const path = require('path')
const noBackend = require('./../../dist/index')//for users require('no-backend')

const app = express();

app.use(express.json());
noBackend({ 
    graphiql_storm:true,
    connection:{
        driver:'mysql',
        host:'localhost',
        port:'3306',
        user:'root',
        password:'gherciu1',
        database:'test'
    }
}).then((result) => {

    app.use('/api',result.noBackendController)

})

const port = process.env.port || 2626;
app.listen(port);
console.log(`Server started at port : ${port}`)
