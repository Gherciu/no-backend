const { GraphQLServer, PubSub, withFilter } = require("graphql-yoga");
const { GraphQLString, GraphQLList } = require("graphql");
const { connection } = require("./testHelpers");
const noBackend = require("./../dist/index");
const pubsub = new PubSub();

(async () => {
    const { typeDefs, resolvers, noBackendExpressController } = await noBackend({
        graphiql_storm: true, //remove this line of code if you do not use graphiql-storm
        connection,
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
            Query: {
                hello: { type: GraphQLString },
                myProducts: types => {
                    //or a function
                    //types ==> all types used to create the schema (inclusiv input types)
                    return { type: new GraphQLList(types.product) };
                }
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
                    hello: (_, args, { req, pubsub, withFilter, connection }) => "Hello!",
                    myProducts: async (_, args, { req, pubsub, withFilter, connection }) => {
                        //connection ==> is equal to (mysql.createPool({...connectionConfig}))
                        return await connection.query("Select * from products");
                    }
                },
                Mutation: {
                    echo: (_, args, { req, pubsub, withFilter, connection }) => {
                        pubsub.publish("echo_topic", { onEcho: args.value });
                        return args.value;
                    }
                },
                Subscription: {
                    onEcho: {
                        subscribe: (_, args, { req, pubsub, withFilter, connection }) => pubsub.asyncIterator("echo_topic")
                    }
                }
            }
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
