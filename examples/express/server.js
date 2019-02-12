const express = require('express');
const noBackend = require('./../../dist/index')

const app = express();

app.use(express.json());

noBackend({ 
    app:app,
    route:'/api',
    graphiql:true,
    connection:{
        driver:'mysql',
        host:'localhost',
        port:'3306',
        user:'root',
        password:'gherciu1',
        database:'test'
    },
    rules:{
        insert:true,
        select:true,
        update:true,
        delete:true
    }
})

const port = process.env.port || 2626;
app.listen(port);
console.log(`Server started at port : ${port}`)
