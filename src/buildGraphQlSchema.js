import { GraphQLObjectType, GraphQLSchema } from "graphql";
import buildTablesGraphQlMutations from "./buildTablesGraphQlMutations";
import buildTablesGraphQlQuerys from "./buildTablesGraphQlQuerys";
import buildTablesGraphQlRowTypes from "./buildTablesGraphQlRowTypes";
import buildTablesGraphQlSubscriptions from "./buildTablesGraphQlSubscriptions";
import { extensions } from "./helpers/constants";
import getOptionsExtensions from "./helpers/getOptionsExtensions";

const buildGraphQlSchema = async (options, tables) => {
    let { tablesRowTypes } = await buildTablesGraphQlRowTypes(tables);
    let { tablesQuerysTypes } = await buildTablesGraphQlQuerys(options, tables, tablesRowTypes);
    let { tablesMutationsTypes } = await buildTablesGraphQlMutations(options, tables);
    let { tablesSubscriptionsTypes } = await buildTablesGraphQlSubscriptions(options, tables, tablesRowTypes);

    return {
        schema: new GraphQLSchema({
            query: new GraphQLObjectType({
                name: "Query",
                description: "GraphQl root query type",
                fields: {
                    ...tablesQuerysTypes,
                    ...getOptionsExtensions(options, { extensionName: extensions["query"], tablesRowTypes })
                }
            }),
            mutation: new GraphQLObjectType({
                name: "Mutation",
                description: "GraphQl root mutation type",
                fields: {
                    ...tablesMutationsTypes,
                    ...getOptionsExtensions(options, { extensionName: extensions["mutation"], tablesRowTypes })
                }
            }),
            subscription: new GraphQLObjectType({
                name: "Subscription",
                description: "GraphQl root subscription type",
                fields: {
                    ...tablesSubscriptionsTypes,
                    ...getOptionsExtensions(options, { extensionName: extensions["subscription"], tablesRowTypes })
                }
            })
        })
    };
};

export default buildGraphQlSchema;
