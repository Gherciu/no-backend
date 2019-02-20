import buildTablesGraphQlMutationsResolvers from './buildTablesGraphQlMutationsResolvers'

const buildGraphQlResolvers = async (options,tables,db) => {

    let { tablesQuerysResolvers } = {}
    let { tablesMutationsResolvers } = await buildTablesGraphQlMutationsResolvers(options,tables,db)
    let { tablesFilesMutationsResolvers } = {}

    return {
        resolvers:{
            ...tablesQuerysResolvers,
            ...tablesMutationsResolvers,
            ...tablesFilesMutationsResolvers
        },
        tablesQuerysResolvers,
        tablesMutationsResolvers,
        tablesFilesMutationsResolvers
    }

}

export default buildGraphQlResolvers