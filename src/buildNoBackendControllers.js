import { graphql } from "graphql";
import renderGraphiQlStorm from "./renderGraphiQlStorm";

const buildNoBackendControllers = async (options, schema, resolvers) => {
    const noBackendExpressController = ({ endpoint, graphiql_storm, context }) => {
        return (req, res, next) => {
            if (endpoint) {
                if (req.method === "POST") {
                    if (req.path === endpoint) {
                        /** P.S maybe I missed something😅
                            In apollo and rest servers in resolvers parameter 1 is root 2 is args 3 is context but in graphql function
                            first parameter is args 2 (resolvers|context) this is diferent and need modifications
                            How to possible fix this:
                            1.update or add other version of graphql
                            2.Aka (kostili) change the parameters structure in all resolvers (😓my way) __rawGraphQlRequest__
                            to know that this request is being executed by raw graphql
                        */
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
                    }
                } else if (req.method === "GET") {
                    if (graphiql_storm) {
                        if (req.path === graphiql_storm) {
                            //if graghiql is enabled and req type is get send this
                            res.status(200).send(renderGraphiQlStorm(options, `${req.protocol}://${req.get("host")}${endpoint}`));
                        }
                    } else {
                        //if graghiql is disabled and req type is get send bad request type
                        res.status(400).send("GET requests to this route is not allowed!");
                    }
                } else {
                    if (req.path === endpoint) {
                        //if request method is not GET or POST
                        res.status(400).send(`This request method  is not allowed !`);
                    }
                }
            }
        };
    };

    return {
        noBackendExpressController
    };
};

export default buildNoBackendControllers;
