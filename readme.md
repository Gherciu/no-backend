<p align="center"><img align="center" style="width:128px" src="https://github.com/Gherciu/no-backend/blob/master/no-backend.png?raw=true"/></p>
<center><h3 align="center"> no-backend </h3></center>
<p align="center">A fast, simple and self-hosted GraphQl backend as a service for your projects</p>

---

### What do no-backend :
Transform your database into working GraphQl schema
* Creates Querys and Querys resolvers for all tables
* Creates Mutations and Mutations resolvers for all tables
* Creates Subscriptions and Subscriptions resolvers for all tables

### Look at this small example 

#### products table:
------------------------------------
| id | title | price | category_id |
-----| ------|-------|-------------|
| 1  | prod1 | 99    | 1           |

#### categorys table:
-------------
 id | title |
----| ------|
 1  | cat1  |
 
 
**cli**
```bash
npm i no-backend graphql
```
**index.js**
```js
const express = require('express');
const noBackend = require('no-backend');
const app = express();
app.use(express.json());

(async ()=>{
    const {noBackendExpressController} = await noBackend({ 
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
    app.use('/api',noBackendExpressController)
})();

app.listen(2626);
console.log(`Server started at port : 2626`)
```
**open browser on ```http://localhost:3000/api``` and see the result**

![no-backend](https://github.com/Gherciu/no-backend/blob/master/no-backend-result.png?raw=true)


## Links
* 🔥 [GraphiQl Storm](https://github.com/Gherciu/graphiql-storm)
* 👉 [Examples](https://github.com/Gherciu/no-backend/tree/master/examples)

## Learn more about "no-backend" through examples 📒

### With rules 

by default all rules is equal to ```true``` 
```diff
   await noBackend({ 
        connection:{
            ...connectionConfig
        },
+        rules:{//rules for all tables
+            _read:false,//boolean
+            _delete:(req)=>(req.user),//or a function that return boolean
+            _insert:false,
+            _update:true
+            _exclude:["categorys_shops","categorys"],//exclude a certain table from schema
+
+            products:{//rules for a certain table
+                _read:true,
+                _insert:(req)=>(req.user.id === 1),//function that return boolean
+                _update:true,
+                _delete:true, 
+            }
+        }
    })
```

### With subscriptions, work if pubsub and withFilter is provided ( [See also the example with Apollo Server](https://github.com/Gherciu/no-backend/tree/master/examples) )

```diff
+ const { GraphQLServer, PubSub, withFilter } = require("graphql-yoga");
+ const noBackend = require("no-backend"); 
+ const pubsub = new PubSub();

(async () => {
    const { typeDefs, resolvers, noBackendExpressController } = await noBackend({
        graphiql_storm: true, //remove this line of code if you do not use graphiql-storm
        connection: {
            ...connectionConfig
        }
    });

+    const server = new GraphQLServer({
+        typeDefs,
+        resolvers,
+        context: req => {
+            return {
+                req,
+                pubsub,
+                withFilter
+            };
+        },
+        subscriptions: "/"
+    });
    server.express.get("/", noBackendExpressController); //remove this line of code if you do not use graphiql-storm
    server.start({ port: 3001, playground: "/playground"}, () =>{
       console.log('Server is running on http://localhost:3001  ( ✨ Playground: http://localhost:3001/playground OR 🚀 GraphiQl Storm: http://localhost:3001 )');
    });
})();
```

-------------------------------------------------------------------------------------------------------

#### If you like this repository star⭐ and watch👀 on  [GitHub](https://github.com/Gherciu/no-backend)

