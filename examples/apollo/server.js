const { ApolloServer } = require("apollo-server");
const noBackend = require("./../../dist/index"); //for users require('no-backend')
const { PubSub, withFilter } = require("graphql-subscriptions");

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
        },
        rules: {
            //rules for all tables (if rule is undefined==>true)
            _read: true,
            _exclude: ["categorys_shops", "categorys"], //exclude a certain table from schema
            products: {
                //rules for a certain table
                _read: true,
                _update: req => true
            }
        }
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return {
                req,
                pubsub,
                withFilter
            };
        },
        subscriptions: "/",
        tracing: true
    });

    server.listen().then(({ url, subscriptionsUrl }) => {
        console.log(`🚀 Server ready at ${url} and subscriptions server at ${subscriptionsUrl}`);
    });
})();
