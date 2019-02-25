
import { tablesMutationsMethods } from './helpers/constants';
import getInsertIds from './helpers/getInsertIds';
import injectToSquel from './helpers/injectToSquel';
import { firstToUpperCase } from './helpers/textHelpers';

const buildTablesGraphQlMutationsResolvers = async (options,tables,db) => {

    let tablesMutationsResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]

        tablesMutationsMethods.forEach((mutationMethod) => {

            switch (mutationMethod) {
                case 'insert':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async ( _,__,context ) => {

                        let args = _?_:__ //for apollo resolvers (args = __) for graphql resolvers (args = _)
                        let statementResult = await db.exec(
                            db.insert()
                            .into(tableName)
                            .setFieldsRows(
                                args[tableName]
                            )   
                        )

                        return {...statementResult,insertIds:getInsertIds(statementResult)}
                        
                    }
                    break
                }  
                case 'update':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (_,__,context) => {
                        
                        let args = _?_:__ //for apollo resolvers (args = __) for graphql resolvers (args = _)
                        let squel = db.update().table(tableName).setFields(args.newValue)
                        squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )
                        let statementResult = await db.exec( squel )

                        return {...statementResult,insertIds:getInsertIds(statementResult)}

                    }
                    break
                }  
                case 'delete':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (_,__,context) => {
                        
                        let args = _?_:__ //for apollo resolvers (args = __) for graphql resolvers (args = _)
                        let squel = db.delete().from(tableName)
                        squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )
                        let statementResult = await db.exec( squel )

                        return {...statementResult,insertIds:getInsertIds(statementResult)}

                    }
                    break
                }                    
                default:{
                    throw new TypeError('Error: Undefined mutation method')
                }
            }

        })

    })

    return {
        tablesMutationsResolvers
    }

}

export default buildTablesGraphQlMutationsResolvers