const express = require("express");
const noBackend = require("./../../dist/index"); //for users require('no-backend')

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
            // Query: {
            //     hello: {
            //         name: "hello",
            //         type: new GraphQLNonNull(GraphQLString)
            //     }
            // }
        }
    });
    app.use("/api", noBackendExpressController);
})();

app.listen(2626);
console.log(`Server started at port : 2626`);
