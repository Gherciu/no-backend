const express = require("express");
const noBackend = require("no-backend");
const { GraphQLString, GraphQLList } = require("graphql");

const app = express();
app.use(express.json());

(async () => {
    const { noBackendExpressController } = await noBackend({
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
                }
            }
        }
    });

    noBackendExpressController({ app, port: 3000, endpoint: "/", graphiql_storm: "/", context: req => ({ req })});
})();
app.listen(3000);
console.log(`Server is running on http://localhost:3000`);
