import { GraphQLObjectType,GraphQLSchema } from 'graphql'
import buildTablesGraphQlTypes from './buildTablesGraphQlTypes'
import buildTablesGraphQlQueries from './buildTablesGraphQlQueries'
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations'
import buildFilesGraphQlMutations from './buildFilesGraphQlMutations'

const buildGraphQlSchema = async (options,tables,db) => {

    let { tablesTypes } = await buildTablesGraphQlTypes( tables )
    let { tablesQuerysTypes } = await buildTablesGraphQlQueries( tables,tablesTypes, )
    let { tablesMutationsTypes } = await buildTablesGraphQlMutations( tables,tablesTypes )
    let { filesMutationsTypes } = await buildFilesGraphQlMutations( options )

    return {
        schema: new GraphQLSchema({ 
            query: new GraphQLObjectType({
                name: 'Query',
                description:'GraphQl root query type',
                fields: {
                    ...tablesQuerysTypes
                }
            }),
            mutation:new GraphQLObjectType({
                name: 'Mutation',
                description:'GraphQl root mutation type',
                fields: {
                    ...tablesMutationsTypes,
                    ...filesMutationsTypes
                }
            })
        }),
        tablesTypes,
        tablesQuerysTypes,
        tablesMutationsTypes,
        filesMutationsTypes
    }

}

export default buildGraphQlSchema