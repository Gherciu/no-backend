const express = require("express");
const noBackend = require("no-backend");
const { GraphQLString } = require("graphql");

const app = express();
app.use(express.json());

(async () => {
    const { noBackendExpressController } = await noBackend({
        graphiql_storm: true,
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
                hello: { type: GraphQLString }
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
                    hello: () => "Hello!"
                },
                Mutation: {
                    echo: (_, args, { req }) => {
                        return args.value;
                    }
                }
            }
        }
    });
    app.use("/api", noBackendExpressController);
})();

app.listen(2626);
console.log(`Server started at port : 2626`);
