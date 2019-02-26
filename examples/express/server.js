const express = require('express');
const noBackend = require('./../../dist/index');//for users require('no-backend')

const app = express();
app.use(express.json());
app.use((req,res,next)=>{
    req.user = {
        id:1,
        name:'Gheorghe'
    }
    next()
});

(async ()=>{

    const { noBackendExpressController } = await noBackend({ 
        graphiql_storm:true,
        connection:{
            driver:'mysql',
            host:'localhost',
            port:'3306',
            user:'root',
            password:'gherciu1',
            database:'test'
        },
        rules:{//rules for all tables
            read:true,//boolean
            delete:(req)=>(req.user),//or a function that return boolean
            prducts:{//rules for a certain table
                read:false,
                insert:(req)=>(req.user.id === 1),//function that return boolean
                update:true,
                delete:true, 
            }
        }
    })
    app.use('/api',noBackendExpressController)

})();


app.listen(2626);
console.log(`Server started at port : 2626`)
