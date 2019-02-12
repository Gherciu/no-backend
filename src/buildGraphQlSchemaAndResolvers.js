import dbProvider from './dbProvider'
import buildTablesSchema from './buildTablesSchema'
import buildTablesResolvers from './buildTablesResolvers'

const buildGraphQlSchemaAndResolvers = async (options) => {

    const db      = new dbProvider(options)
    const tables  = await db.exec('show tables')
    let schema    = await buildTablesSchema(options,tables,db)
    let resolvers = await buildTablesResolvers(options,tables,db);

    return {
        schema,
        resolvers
    }

}

export default buildGraphQlSchemaAndResolvers