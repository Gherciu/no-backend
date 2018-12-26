const express = require('express');
const {dbMiddleware} = require('./../../dist/index')

const app = express();
const port = process.env.port || 2626;
const tablesRules = {
    products:{
        limit:100,
        create:true,
        read:true,
        update:true,
        delete:true
    }
}

app.use(express.json());
app.use('/db',dbMiddleware({
    db:{
        driver:'mysql',
        host:'localhost',
        port:'3036',
        user:'root',
        password:'123456789'
    },
    tablesRules:tablesRules,
    graphiql:true
}));

app.listen(port);
console.log(`Server started at port : ${port}`)
