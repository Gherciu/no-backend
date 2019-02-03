const express = require('express');
const {dbMiddleware} = require('./../../dist/index')

const app = express();

app.use(express.json());
app.use(dbMiddleware({
    route:'/db',
    connection:{
        driver:'mysql',
        host:'localhost',
        port:'3036',
        user:'root',
        password:'123456789'
    },
    rules:{
        limit:100,
        create:true,
        read:true,
        update:true,
        delete:true
    },
    graphiql:true
}));



const port = process.env.port || 2626;
app.listen(port);
console.log(`Server started at port : ${port}`)
