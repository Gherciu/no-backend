import { GraphQLSchema } from 'graphql'
import buildTablesQueries from './helpers/buildTablesQueries'

const buildTablesSchema = async (options,tables,db) => {
    
    let { query,tablesRowsTypes } = await buildTablesQueries(tables)

    return new GraphQLSchema({...query})

}

export default buildTablesSchema