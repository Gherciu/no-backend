import dbProvider from './dbProvider'
import buildTablesSchema from './buildTablesSchema'
import buildTablesResolvers from './buildTablesResolvers'
import tablesValidator from './helpers/tablesValidator'

const buildGraphQlSchemaAndResolvers = async (options) => {

    const db      = new dbProvider(options)
    const tables  = await db.exec('show tables')
    
    for (let i = 0; i < tables.length; i++) {//get tables desc
        let tableName = Object.values(tables[i])[0]
        tables[i] = {...tables[i],desc:await db.exec(`desc ${tableName}`)}
    }
    const tablesValidatorMessage = tablesValidator(tables)

    if(tablesValidatorMessage){

        throw new TypeError(tablesValidatorMessage)

    }else{

        let schema    = await buildTablesSchema(options,tables,db)
        let resolvers = await buildTablesResolvers(options,tables,db);
    
        return {
            schema,
            resolvers
        }

    }

}

export default buildGraphQlSchemaAndResolvers