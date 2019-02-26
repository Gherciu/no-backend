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
        // rules:{//rules for all tables (if rule is undefined==>true)
        //     _read:true,
        //     _delete:false,
        //     products:{//rules for a certain table
        //         _read:true,
        //         _delete:(req)=>(req.user && req.user.id===1),
        //         _update:(req)=>false,
        //         _insert:(req)=>(req.user && req.user.name==='Gheorghe')
        //     }
        // }
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
