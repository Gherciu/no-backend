import buildTablesGraphQlMutationsResolvers from './buildTablesGraphQlMutationsResolvers';
import buildTablesGraphQlQuerysResolvers from './buildTablesGraphQlQuerysResolvers';
import buildTablesGraphQlSubscriptionsResolvers from './buildTablesGraphQlSubscriptionsResolvers';

const buildGraphQlResolvers = async (options,tables,db) => {
    
    let { tablesQuerysResolvers } = await buildTablesGraphQlQuerysResolvers(options,tables,db)
    let { tablesMutationsResolvers } = await buildTablesGraphQlMutationsResolvers(options,tables,db)
    let { tablesSubscriptionsResolvers } = await buildTablesGraphQlSubscriptionsResolvers(options,tables)

    return {
        resolvers:{
            Query:{
                ...tablesQuerysResolvers
            },
            Mutation:{
                ...tablesMutationsResolvers
            },
            Subscription:{
                ...tablesSubscriptionsResolvers
            }
        },
        tablesQuerysResolvers,
        tablesMutationsResolvers,
        tablesSubscriptionsResolvers
    }

}

export default buildGraphQlResolvers