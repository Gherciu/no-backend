import optionsValidator from './optionsValidator'
import registerMiddleware from './registerMiddleware'
import dbProvider from './dbProvider'
import buildTablesGraphQlSchema from './buildTablesGraphQlSchema'
import buildTablesGraphQlResolvers from './buildTablesGraphQlResolvers'
import tablesValidator from './tablesValidator'

const noBackend = async ( options )=>{

    const optionsValidatorMessage = optionsValidator( options )

    if( optionsValidatorMessage ){

        throw new TypeError( optionsValidatorMessage )

    }else{

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
    
            let schema    = await buildTablesGraphQlSchema(options,tables,db)
            let resolvers = await buildTablesGraphQlResolvers(options,tables,db);
          
            registerMiddleware( options,schema,resolvers )
    
        }
    }

}

export default noBackend