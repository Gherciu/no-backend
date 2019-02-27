<p align="center"><img align="center" style="width:128px" src="https://github.com/Gherciu/no-backend/blob/master/no-backend.png?raw=true"/></p>
<center><h1 align="center"> no-backend </h1></center>

### What do no-backend :
Transform your database into working GraphQl schema
* Creates Querys and Querys resolvers for all tables
* Creates Mutations and Mutations resolvers for all tables
* Creates Subscriptions and Subscriptions resolvers for all tables

### Look at this small example 

products table:
------------------------------------
| id | title | price | category_id |
-----| ------|-------|-------------|
| 1  | prod1 | 99    | 1           |

categorys table:
-------------
 id | title |
----| ------|
 1  | cat1  |
 
 
**cli**
```bash
npm i no-backend
```
**index.js**
```js
const express = require('express');
const noBackend = require('no-backend');

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
```
**open browser on ```http://localhost:3000/api``` and see the result**

![no-backend](https://github.com/Gherciu/no-backend/blob/master/no-backend-result.png?raw=true)


## Links
* 📘 [Documentation](https://github.com/Gherciu/no-backend/tree/master/docs)
* 🔥 [GraphiQl Storm](https://github.com/Gherciu/graphiql-storm)
* 👉 [Examples](https://github.com/Gherciu/no-backend/tree/master/examples)

## Use with Apollo and GraphQl-Playground
```js
const { ApolloServer } = require('apollo-server');
const noBackend = require('no-backend');

(async () => {

    const {typeDefs,resolvers} = await noBackend({ 
        connection:{
            driver:'mysql',
            host:'localhost',
            port:'3306',
            user:'root',
            password:'gherciu1',
            database:'test'
        }
    });
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({req})=>{
            return {
                req
            }
        }
    });

    server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
    });

})();
```

## with rules 

by default all rules is equal to ```true``` if typeof certain rule is ```undefined``` this is equal to ```true```
```js
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
            _read:false,//boolean
            _delete:(req)=>(req.user),//or a function that return boolean
            _insert:false,
            _update:undefined,//undefined --> true
            _exclude:["categorys_shops","categorys"],//exclude a certain table from schema

            products:{//rules for a certain table
                _read:false,
                _insert:(req)=>(req.user.id === 1),//function that return boolean
                _update:true,
                _delete:true, 
            }
            
        }
    })
    app.use('/api',noBackendExpressController)

})();


app.listen(2626);
```

-------------------------------------------------------------------------------------------------------

#### If you like this repository star⭐ and watch👀 on  [GitHub](https://github.com/Gherciu/no-backend)

