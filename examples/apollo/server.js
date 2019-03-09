const { ApolloServer } = require("apollo-server");
const { GraphQLString, GraphQLList } = require("graphql");
const noBackend = require("no-backend");
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
        },
        extend: {
            Query: {
                hello: { type: GraphQLString },
                getProducts: types => ({ type: new GraphQLList(types.product) })
            },
            Mutation: {
                echo: {
                    type: GraphQLString,
                    args: {
                        value: { type: GraphQLString }
                    }
                }
            },
            Subscription: {
                onEcho: {
                    type: GraphQLString
                }
            },
            Resolvers: {
                Query: {
                    hello: () => "Hello!",
                    getProducts: async (_, arg, { connection }) => {
                        return await connection.query("SELECT * FROM products");
                    }
                },
                Mutation: {
                    echo: (_, args, { req, pubsub, withFilter }) => {
                        pubsub.publish("echo_topic", { onEcho: args.value });
                        return args.value;
                    }
                },
                Subscription: {
                    onEcho: {
                        subscribe: (_, args, { req, pubsub, withFilter }) => pubsub.asyncIterator("echo_topic")
                    }
                }
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
