const { ApolloServer } = require('apollo-server');
const noBackend = require('./../../dist/index');//for users require('no-backend')

(async () => {

    const {typeDefs,resolvers} = await noBackend({ 
        connection:{
            driver:'mysql',
            host:'localhost',
            port:'3306',
            user:'root',
            password:'gherciu1',
            database:'test'
        },
        tablesRules:{//rules for all tables (if rule is undefined==>true)
            read:true,
            delete:false,
            products:{//rules for a certain table
                read:true,
                delete:(req)=>(req.user && req.user.id===1),
                update:(req)=>false,
                insert:(req)=>(req.user && req.user.name==='Gheorghe')
            }
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
