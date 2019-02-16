import { GraphQLSchema } from 'graphql'
import buildTablesGraphQlTypes from './buildTablesGraphQlTypes'
import buildTablesGraphQlQueries from './buildTablesGraphQlQueries'
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations'

const buildTablesGraphQlSchema = async (options,tables,db) => {
    
    let { tablesTypes,tablesRowTypes } = await buildTablesGraphQlTypes( tables )
    let { query } = await buildTablesGraphQlQueries( tables,tablesTypes )
    let { mutation } = await buildTablesGraphQlMutations( tables,tablesTypes,tablesRowTypes )

    return new GraphQLSchema({ query,mutation })

}

export default buildTablesGraphQlSchema