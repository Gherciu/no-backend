const { GraphQLServer } = require('graphql-yoga')
const noBackend = require('./../../dist/index');//for users require('no-backend')

(async () => {

    const {typeDefs,resolvers,noBackendExpressController} = await noBackend({ 
        graphiql_storm:true,//remove this line of code if you do not use graphiql-storm
        connection:{
            driver:'mysql',
            host:'localhost',
            port:'3306',
            user:'root',
            password:'gherciu1',
            database:'test'
        },
        rules:{//rules for all tables (if rule is undefined==>true)
            _read:true,
            _delete:true,
            _exclude:["categorys_shops","categorys"],//exclude a certain table from schema
            products:{//rules for a certain table
                _read:true,
                _update:(req)=>true,
            }
        }
    });
    
    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: (req) => {
            return {
                req
            }
        },
        middlewares:[async (resolve, root, args, context, info)=>{
            context.req.user = {id:1}//auth imitation
            return await resolve(root, args, context, info)
        }]
    });

    server.express.get('/',noBackendExpressController)//remove this line of code if you do not use graphiql-storm

    server.start({port:3001,playground:"/playground"},() => console.log('Server is running on http://localhost:3001  ( 🚀 GraphiQl Storm: http://localhost:3001  OR ✨ Playground: http://localhost:3001/playground )'))

})();
