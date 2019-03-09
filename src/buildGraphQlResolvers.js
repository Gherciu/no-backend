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
                ...getOptionsExtensions(options, {
                    extensionName: extensions["resolvers"]._name,
                    extensionPartName: extensions["resolvers"].query,
                    db
                })
            },
            Mutation: {
                ...tablesMutationsResolvers,
                ...getOptionsExtensions(options, {
                    extensionName: extensions["resolvers"]._name,
                    extensionPartName: extensions["resolvers"].mutation,
                    db
                })
            },
            Subscription: {
                ...tablesSubscriptionsResolvers,
                ...getOptionsExtensions(options, {
                    extensionName: extensions["resolvers"]._name,
                    extensionPartName: extensions["resolvers"].subscription,
                    db
                })
            }
        }
    };
};

export default buildGraphQlResolvers;
