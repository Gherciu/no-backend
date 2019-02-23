import { GraphQLObjectType,GraphQLSchema } from 'graphql'
import buildTablesGraphQlTypes from './buildTablesGraphQlTypes'
import buildTablesGraphQlQuerys from './buildTablesGraphQlQuerys'
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations'

const buildGraphQlSchema = async (options,tables,db) => {

    let { tablesTypes,tablesRowTypes } = await buildTablesGraphQlTypes( tables )
    let { tablesQuerysTypes } = await buildTablesGraphQlQuerys( tables,tablesTypes, )
    let { tablesMutationsTypes } = await buildTablesGraphQlMutations( tables,tablesTypes )

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
                    ...tablesMutationsTypes
                }
            })
        }),
        tablesTypes,
        tablesRowTypes,
        tablesQuerysTypes,
        tablesMutationsTypes
    }

}

export default buildGraphQlSchema