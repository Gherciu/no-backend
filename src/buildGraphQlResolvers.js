import buildTablesGraphQlMutationsResolvers from "./buildTablesGraphQlMutationsResolvers";
import buildTablesGraphQlQuerysResolvers from "./buildTablesGraphQlQuerysResolvers";
import buildTablesGraphQlSubscriptionsResolvers from "./buildTablesGraphQlSubscriptionsResolvers";
import { extensions } from "./helpers/constants";
import getOptionsExtensions from "./helpers/getOptionsExtensions";

const buildGraphQlResolvers = async (options, tables, db) => {
    let { tablesQuerysResolvers } = await buildTablesGraphQlQuerysResolvers(options, tables, db);
    let { tablesMutationsResolvers } = await buildTablesGraphQlMutationsResolvers(options, tables, db);
    let { tablesSubscriptionsResolvers } = await buildTablesGraphQlSubscriptionsResolvers(options, tables);

    return {
        resolvers: {
            Query: {
                ...tablesQuerysResolvers,
                ...getOptionsExtensions(options, extensions["resolvers"]._name, extensions["resolvers"].query)
            },
            Mutation: {
                ...tablesMutationsResolvers,
                ...getOptionsExtensions(options, extensions["resolvers"]._name, extensions["resolvers"].mutation)
            },
            Subscription: {
                ...tablesSubscriptionsResolvers,
                ...getOptionsExtensions(options, extensions["resolvers"]._name, extensions["resolvers"].subscription)
            }
        },
        tablesQuerysResolvers,
        tablesMutationsResolvers,
        tablesSubscriptionsResolvers
    };
};

export default buildGraphQlResolvers;
