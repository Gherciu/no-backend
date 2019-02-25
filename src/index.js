import buildGraphQlResolvers from './buildGraphQlResolvers';
import buildGraphQlSchema from './buildGraphQlSchema';
import dbProvider from './helpers/dbProvider';
import noBackendController from './noBackendController';
import optionsValidator from './optionsValidator';
import tablesValidator from './tablesValidator';

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
    
            let { schema,tablesQuerysTypes,tablesMutationsTypes,filesMutationsTypes,tablesRowTypes }    = await buildGraphQlSchema(options,tables,db)
            let { resolvers,tablesQuerysResolvers,tablesMutationsResolvers,filesMutationsResolvers } = await buildGraphQlResolvers(options,tables,db);
          
            return {

                noBackendController: noBackendController( options,schema,resolvers ),
                //tables types
                tablesRowTypes,
                //tables queries & tables mutations --> schema
                schema,
                tablesQuerysTypes,
                tablesMutationsTypes,
                filesMutationsTypes,
                ////tables queries resolvers & tables mutations resolvers --> resolvers
                resolvers,
                tablesQuerysResolvers,
                tablesMutationsResolvers,
                filesMutationsResolvers,
                //database provider
                db
                
            }
    
        }
    }

}

export default noBackend