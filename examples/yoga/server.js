const { GraphQLServer, PubSub, withFilter } = require("graphql-yoga");
const { GraphQLString, GraphQLNonNull } = require("graphql");
const noBackend = require("./../../dist/index"); //for users require('no-backend')
const pubsub = new PubSub();

(async () => {
    const { typeDefs, resolvers, noBackendExpressController } = await noBackend({
        graphiql_storm: true, //remove this line of code if you do not use graphiql-storm
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
            _delete: true,
            _exclude: ["categorys_shops", "shops"], //exclude a certain table from schema
            products: {
                //rules for a certain table
                _read: true,
                _update: req => true
            }
        },
        extend: {
            // Query: {
            //     hello: {
            //         name: "hello",
            //         type: new GraphQLNonNull(GraphQLString)
            //     }
            // }
            // Mutation: {
            //     echo: {
            //         name: "echo",
            //         type: GraphQLString,
            //         args: {
            //             value: { type: new GraphQLNonNull(GraphQLString) }
            //         }
            //     }
            // },
            // Subscription: {
            //     onEcho: {
            //         name: "onEcho",
            //         type: GraphQLString
            //     }
            // },
            // Resolvers: {
            //     Query: {
            //         hello: (_, args, { req, pubsub }) => "Hi!"
            //     },
            //     Mutation: {
            //         echo: (_, args, { req, pubsub }) => {
            //             pubsub.publish("echo_topic", { echo: args.value });
            //             return args.value;
            //         }
            //     },
            //     Subscription: {
            //         onEcho: {
            //             subscribe: (_, args, { req, pubsub, withFilter }) => {
            //                 return pubsub.asyncIterator("echo_topic");
            //             }
            //         }
            //     }
            // }
        }
    });

    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: req => {
            return {
                req,
                pubsub, //add PubSub to context
                withFilter
            };
        },
        subscriptions: "/",
        middlewares: [
            async (resolve, root, args, context, info) => {
                context.req.user = { id: 1 }; //auth imitation
                return await resolve(root, args, context, info);
            }
        ]
    });

    server.express.get("/", noBackendExpressController); //remove this line of code if you do not use graphiql-storm

    server.start({ port: 3001, playground: "/playground", tracing: true }, () =>
        console.log(
            `Server is running on http://localhost:3001  ( 🚀 GraphiQl Storm: http://localhost:3001  OR ✨ Playground: http://localhost:3001/playground )`
        )
    );
})();
