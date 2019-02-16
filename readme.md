# no-backend
![no-backend](/no-backend.png)

## What do no-backend :
**1.Transform your database into working GraphQl schema and create (queries,mutations) for this tables**

**2.Add tables to your database for users authentication and also create (queries,mutations) for this tables**

**3.Add (mutations) for files upload with GraphQl**

### Look at this small example 

**database tables**

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
const noBackend = require('no-backend')
const app = express();

app.use(express.json());

noBackend({ 
    graphiql_storm:true, // A Web IDE for GraphQl
    connection:{
        driver:'mysql', // mysql OR postgres OR sqlite
        host:'localhost',
        user:'root',
        password:'test-password',
        database:'test-database'
    }
}).then(( noBackendController ) => {

    app.use('/api',noBackendController)

})

const port = 3000;
app.listen(port);
console.log(`Server started at port : ${port}`)
```
**browser on ```http://localhost:3000/api```**

-------------------------------------------------------------------------------------------------------

#### If you like this repository star⭐ and watch👀 on  [GitHub](https://github.com/Gherciu/no-backend)

