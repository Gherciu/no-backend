import buildTablesGraphQlMutationsResolvers from './buildTablesGraphQlMutationsResolvers'
import buildFilesGraphQlMutationsResolvers from './buildFilesGraphQlMutationsResolvers'
import buildTablesGraphQlQuerysResolvers from './buildTablesGraphQlQuerysResolvers'

const buildGraphQlResolvers = async (options,tables,db) => {

    let { tablesQuerysResolvers } = await buildTablesGraphQlQuerysResolvers(options,tables,db)
    let { tablesMutationsResolvers } = await buildTablesGraphQlMutationsResolvers(options,tables,db)
    let { filesMutationsResolvers } = await buildFilesGraphQlMutationsResolvers(options)

    return {
        resolvers:{
            ...tablesQuerysResolvers,
            ...tablesMutationsResolvers,
            ...filesMutationsResolvers
        },
        tablesQuerysResolvers,
        tablesMutationsResolvers,
        filesMutationsResolvers
    }

}

export default buildGraphQlResolvers