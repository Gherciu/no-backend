<p align="center"><img align="center" style="width:128px" src="https://github.com/Gherciu/no-backend/blob/master/no-backend.png?raw=true"/></p>

<center><h3 align="center"> no-backend </h3></center>
<p align="center">A fast, simple and self-hosted GraphQl backend as a service for your projects</p>

---

### What do no-backend :

Transform your database into working GraphQl schema

-   Creates Querys and Querys resolvers for all tables
-   Creates Mutations and Mutations resolvers for all tables
-   Creates Subscriptions and Subscriptions resolvers for all tables

### Look at this small example

#### products table:

| id  | title | price | category_id |
| --- | ----- | ----- | ----------- |
| 1   | prod1 | 99    | 1           |

#### categorys table:

| id  | title |
| --- | ----- |
| 1   | cat1  |

**cli**

```bash
npm i no-backend graphql
```

**index.js**

See more examples with ( [Apollo-Server](https://github.com/Gherciu/no-backend/tree/master/examples/apollo) ,[GraphQL-Yoga](https://github.com/Gherciu/no-backend/tree/master/examples/yoga) , [Apollo-Express](https://github.com/Gherciu/no-backend/tree/master/examples/apollo-express) and [Express](https://github.com/Gherciu/no-backend/tree/master/examples/express) )

```js
const { GraphQLServer, PubSub, withFilter } = require("graphql-yoga");
const noBackend = require("no-backend");
const pubsub = new PubSub();

(async () => {
    const { typeDefs, resolvers } = await noBackend({
        connection: {
            driver: "mysql",
            host: "localhost",
            port: "3306",
            user: "root",
            password: "gherciu1",
            database: "test"
        }
    });
    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: req => {
            return {
                req,
                pubsub,
                withFilter
            };
        },
        subscriptions: "/"
    });

    server.start({ port: 3000 }, () => {
        console.log("Server is running on http://localhost:3000");
    });
})();
```

**open browser on `http://localhost:3000` and see the result**

![no-backend](https://github.com/Gherciu/no-backend/blob/master/no-backend-result.png?raw=true)

## Links

-   🔥 [GraphiQl Storm](https://github.com/Gherciu/graphiql-storm)
-   👉 [Examples](https://github.com/Gherciu/no-backend/tree/master/examples)

---

### With rules

by default all rules is equal to `true`

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

### Extend schema (mutations,querys,subscriptions) and resolvers

```diff
+ const { GraphQLString,GraphQLList } = require("graphql");

   await noBackend({
        connection:{
            ...connectionConfig
        },
+        extend: {
+            Query: {
+                hello: { type: GraphQLString },
+                myProducts: ( types ) => { //or a function
+                    //types ==> all types used to create the schema (inclusiv input types)
+                    return { type: new GraphQLList( types.product ) };
+                }
+            },
+            Mutation: {
+                echo: {
+                    type: GraphQLString,
+                    args: {
+                        value: { type: GraphQLString }
+                    }
+                }
+            },
+            Subscription: {
+                onEcho: {
+                    type: GraphQLString
+                }
+            },
+            Resolvers: {
+                Query: {
+                    hello: () => ("Hello!"),
+                    myProducts: async (_, args, { req, pubsub, connection }) => {
+                        //connection ==> is equal to ( mysql.createPool({...connectionConfig}) )
+                        return await connection.query("SELECT * FROM products");
+                    }
+                },
+                Mutation: {
+                    echo: (_, args, { req, pubsub, connection }) => {
+                        pubsub.publish("echo_topic", { onEcho: args.value });
+                        return args.value;
+                    }
+                },
+                Subscription: {
+                    onEcho: {
+                        subscribe: (_, args, { req, pubsub, withFilter, connection }) => pubsub.asyncIterator("echo_topic")
+                    }
+                }
+            }
+        }
    })
```

---

#### If you like this repository star⭐ and watch👀 on [GitHub](https://github.com/Gherciu/no-backend)
