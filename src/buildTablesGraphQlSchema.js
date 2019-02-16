import { GraphQLSchema } from 'graphql'
import buildTablesGraphQlQueries from './buildTablesGraphQlQueries'

const buildTablesGraphQlSchema = async (options,tables,db) => {
    
    let { query,tablesRowTypes } = await buildTablesGraphQlQueries(tables)

    return new GraphQLSchema({...query})

}

export default buildTablesGraphQlSchema