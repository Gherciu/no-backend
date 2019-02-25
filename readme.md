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

-------------------------------------------------------------------------------------------------------

#### If you like this repository star⭐ and watch👀 on  [GitHub](https://github.com/Gherciu/no-backend)

