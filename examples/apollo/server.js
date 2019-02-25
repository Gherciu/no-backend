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
        }
    });
    
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
    });

})();
