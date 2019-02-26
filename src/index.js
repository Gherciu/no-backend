import { printSchema } from 'graphql';
import buildGraphQlResolvers from './buildGraphQlResolvers';
import buildGraphQlSchema from './buildGraphQlSchema';
import buildNoBackendControllers from './buildNoBackendControllers';
import dbProvider from './helpers/dbProvider';
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
    
            let { schema,tablesQuerysTypes,tablesMutationsTypes,tablesRowTypes }    = await buildGraphQlSchema(options,tables,db)
            let { resolvers,tablesQuerysResolvers,tablesMutationsResolvers } = await buildGraphQlResolvers(options,tables,db)
            let { noBackendExpressController } = await buildNoBackendControllers(options,schema,{ ...tablesQuerysResolvers, ...tablesMutationsResolvers })
            
            return {

                //ready controllers
                noBackendExpressController,
                //tables row types
                tablesRowTypes,
                //tables queries & tables mutations --> schema
                schema,
                tablesQuerysTypes,
                tablesMutationsTypes,
                //tables queries resolvers & tables mutations resolvers --> resolvers
                resolvers,
                tablesQuerysResolvers,
                tablesMutationsResolvers,
                //database provider
                db,
                //helpers
                typeDefs : printSchema(schema) //schema in string format
                
            }
    
        }
    }

}

export default noBackend