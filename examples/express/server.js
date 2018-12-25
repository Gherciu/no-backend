const express = require('express');
const {dbMiddleware,filesMiddleware} = require('./../../dist/index')
const tablesSchema = require('./tablesSchema')

const app = express();
const port = process.env.port || 2626;

app.use('/db',dbMiddleware({
    tablesSchema:tablesSchema,
    graphiql:true
}));
app.use('/files',filesMiddleware({
    
}));

app.listen(port);
console.log(`Server started at port : ${port}`)
