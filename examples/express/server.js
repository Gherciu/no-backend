const express = require('express');
const {dbMiddleware,filesMiddleware} = require('./../../dist/index')
const tablesSchema = require('./tablesSchema')

const app = express();
const port = process.env.port || 2626;

app.use('/db',dbMiddleware({
    db:{
        driver:'mysql',
        host:'localhost',
        port:'3036',
        user:'root',
        password:'123456789'
    },
    tablesSchema:tablesSchema,
    graphiql:true
}));
app.use('/files',filesMiddleware({
    graphiql:true
}));

app.listen(port);
console.log(`Server started at port : ${port}`)
