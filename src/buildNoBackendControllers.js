import { graphql } from "graphql";
import renderGraphiQlStorm from "./renderGraphiQlStorm";

const buildNoBackendControllers = async (options, schema, resolvers) => {
    const noBackendExpressController = ({ endpoint, graphiql_storm, context, app, port }, cb) => {
        if (app) {
            if (endpoint) {
                app.post(endpoint, (req, res) => {
                    let ctx = {};
                    if (context) {
                        if (typeof context === "function") {
                            ctx = context(req);
                        } else if (typeof context === "object") {
                            ctx = { ...context };
                        } else {
                            throw new TypeError("Error: context option must be an object or a function why return an object");
                        }
                    }
                    graphql(schema, req.body.query, resolvers, { ...ctx, __rawGraphQlRequest__: true }, req.body.variables).then(response => {
                        //send data or errors to client
                        res.status(200).json(response);
                    });
                });
                if (graphiql_storm) {
                    app.get(graphiql_storm, (req, res) => {
                        res.status(200).send(renderGraphiQlStorm(options, `${req.protocol}://${req.get("host")}${endpoint}`));
                    });
                }
                if (port) {
                    app.listen(port,()=>{
                        if (cb) {
                            cb({ port });
                        }
                    })
                } else {
                    throw new TypeError("Error:option port is required!");
                }
            } else {
                throw new TypeError("Error:option endpoint is required!");
            }
        } else {
            throw new TypeError("Error:option app is required!");
        }
    };

    return {
        noBackendExpressController
    };
};

export default buildNoBackendControllers;
