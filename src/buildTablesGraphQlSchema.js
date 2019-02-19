import { GraphQLObjectType,GraphQLSchema } from 'graphql'
import buildTablesGraphQlTypes from './buildTablesGraphQlTypes'
import buildTablesGraphQlQueries from './buildTablesGraphQlQueries'
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations'
import buildFilesGraphQlMutations from './buildFilesGraphQlMutations'

const buildTablesGraphQlSchema = async (options,tables,db) => {

    let { tablesTypes } = await buildTablesGraphQlTypes( tables )
    let { tablesQueryTypes } = await buildTablesGraphQlQueries( tables,tablesTypes, )
    let { tablesMutationTypes } = await buildTablesGraphQlMutations( tables,tablesTypes )
    let { filesMutationTypes } = await buildFilesGraphQlMutations( options )

    return new GraphQLSchema({ 
        query: new GraphQLObjectType({
            name: 'Query',
            description:'GraphQl root query type',
            fields: {
                ...tablesQueryTypes
            }
        }),
        mutation:new GraphQLObjectType({
            name: 'Mutation',
            description:'GraphQl root mutation type',
            fields: {
                ...tablesMutationTypes,
                ...filesMutationTypes
            }
        })
    })

}

export default buildTablesGraphQlSchema