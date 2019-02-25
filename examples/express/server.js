const express = require('express');
const noBackend = require('./../../dist/index');//for users require('no-backend')

const app = express();
app.use(express.json());

(async ()=>{

    const {noBackendController} = await noBackend({ 
        graphiql_storm:true,
        connection:{
            driver:'mysql',
            host:'localhost',
            port:'3306',
            user:'root',
            password:'gherciu1',
            database:'test'
        }
    })
    app.use('/api',noBackendController)

})();


app.listen(2626);
console.log(`Server started at port : 2626`)
