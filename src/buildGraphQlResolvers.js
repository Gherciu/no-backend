import buildTablesGraphQlMutationsResolvers from './buildTablesGraphQlMutationsResolvers';
import buildTablesGraphQlQuerysResolvers from './buildTablesGraphQlQuerysResolvers';

const buildGraphQlResolvers = async (options,tables,db) => {

    let { tablesQuerysResolvers } = await buildTablesGraphQlQuerysResolvers(options,tables,db)
    let { tablesMutationsResolvers } = await buildTablesGraphQlMutationsResolvers(options,tables,db)

    return {
        resolvers:{
            Query:{
                ...tablesQuerysResolvers
            },
            Mutation:{
                ...tablesMutationsResolvers
            }
        },
        tablesQuerysResolvers,
        tablesMutationsResolvers
    }

}

export default buildGraphQlResolvers