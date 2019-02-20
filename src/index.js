import optionsValidator from './optionsValidator'
import noBackendController from './noBackendController'
import dbProvider from './helpers/dbProvider'
import buildGraphQlSchema from './buildGraphQlSchema'
import buildGraphQlResolvers from './buildGraphQlResolvers'
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
    
            let { schema,tablesQuerysTypes,tablesMutationsTypes,filesMutationsTypes,tablesTypes }    = await buildGraphQlSchema(options,tables,db)
            let { resolvers,tablesQuerysResolvers,tablesMutationsResolvers,tablesFilesMutationsResolvers } = await buildGraphQlResolvers(options,tables,db);
          
            return {

                noBackendController: noBackendController( options,schema,resolvers ),
                tablesTypes,
                //tables queries & tables mutations --> schema
                schema,
                tablesQuerysTypes,
                tablesMutationsTypes,
                filesMutationsTypes,
                ////tables queries resolvers & tables mutations resolvers --> resolvers
                resolvers,
                tablesQuerysResolvers,
                tablesMutationsResolvers,
                tablesFilesMutationsResolvers
                
            }
    
        }
    }

}

export default noBackend