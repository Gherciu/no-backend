const express = require('express');
const noBackend = require('./src/index')

const port = process.env.port || 2626
const app = express();

app.use('/db',noBackend.db({
    driver:'mysql',
    host:'localhost',
    user:'root',
    password:'',
    graphiql:true
}));

app.listen(port);

console.log(`Server started at port : ${port}`)
