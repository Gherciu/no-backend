
import { rules, tablesMutationsMethods, tablesSubscriptionsMethods } from './helpers/constants';
import getInseretIds from './helpers/getInseretIds';
import getRecursiveRelationTables from './helpers/getRecursiveRelationTables';
import injectToSquel from './helpers/injectToSquel';
import rulesReader from './helpers/rulesReader';
import { firstToUpperCase } from './helpers/textHelpers';

const buildTablesGraphQlMutationsResolvers = async (options,tables,db) => {

    let tablesMutationsResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]

        tablesMutationsMethods.forEach((mutationMethod) => {

            switch (mutationMethod) {
                case 'insert':{
                    let isActionAllowed = rulesReader(options.rules,rules['exclude'],tableName)

                    if(isActionAllowed){//if is not table excluded from schema
                        
                        tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async ( _,args,context ) => {

                            if(args.__rawGraphQlRequest__){//if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = {...args}
                                args = _
                            }
                            let isActionAllowed = rulesReader(options.rules,rules['insert'],tableName,context.req)
                            
                            if(isActionAllowed){
                                
                                let statementResult = await db.exec(
                                    db.insert()
                                    .into(tableName)
                                    .setFieldsRows(
                                        args[tableName]
                                    )   
                                )
                                
                                if(statementResult){

                                    if(context.pubsub && statementResult.insertId>0){//send to subscriptions
                                    
                                        let rowsInseret = await db.exec(
                                            db.select()
                                            .from(tableName)
                                            .where('id IN ?',getInseretIds(statementResult))
                                        )
    
                                        if(rowsInseret && Array.isArray(rowsInseret)){
    
                                            let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                                            let recursiveStatementResult = await getRecursiveRelationTables(rowsInseret,relationsFields,tables,db)
                                            
                                            context.pubsub.publish(`${tablesSubscriptionsMethods['insert']}${firstToUpperCase(tableName)}`,{
                                                [`${tablesSubscriptionsMethods['insert']}${firstToUpperCase(tableName)}`]:recursiveStatementResult
                                            })
    
                                        }else{
                                            throw new Error(`Error: on get ${mutationMethod} rows from ${tableName}`)
                                        }

                                    }

                                    return {...statementResult,insertIds:getInseretIds(statementResult)}

                                }else{
                                    throw new Error(`Error: on ${mutationMethod} from ${tableName}!`)
                                }
                            }else{
                                throw new Error(`Action (${rules['insert']}) is not allowed for table (${tableName})`)
                            }
                        }
                        
                    }
                    break
                }  
                case 'update':{
                    let isActionAllowed = rulesReader(options.rules,rules['exclude'],tableName)

                    if(isActionAllowed){//if is not table excluded from schema

                        tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (_,args,context) => {
                            
                            if(args.__rawGraphQlRequest__){//if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = {...args}
                                args = _
                            }
                            let isActionAllowed = rulesReader(options.rules,rules['update'],tableName,context.req)
                            
                            if(isActionAllowed){
                                
                                let rowsToUpdate = await db.exec(
                                    injectToSquel( db, db.select().from(tableName), args.filters, args.limit, args.offset, args.order )
                                );

                                if(rowsToUpdate && Array.isArray(rowsToUpdate)){

                                    let statementResult = await db.exec( 
                                        db.update().table(tableName)
                                        .where('id IN ?',rowsToUpdate.map((row)=>row.id))
                                        .setFields(args.newValue)
                                    );
    
                                    if(statementResult){

                                        if(context.pubsub && statementResult.changedRows && statementResult.changedRows>0){//send to subscriptions
    
                                            let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                                            let recursiveStatementResult = await getRecursiveRelationTables(rowsToUpdate,relationsFields,tables,db)
                                            
                                            context.pubsub.publish(`${tablesSubscriptionsMethods['update']}${firstToUpperCase(tableName)}`,{
                                                [`${tablesSubscriptionsMethods['update']}${firstToUpperCase(tableName)}`]:recursiveStatementResult
                                            })
        
                                        }
    
                                        return {...statementResult,updatedIds:rowsToUpdate.map((row)=>row.id)}

                                    }else{
                                        throw new Error(`Error: on ${mutationMethod} from ${tableName}!`)
                                    }
                                }else{
                                    throw new Error(`Error: on get rows to ${mutationMethod} from ${tableName}`)
                                }
                            }else{
                                throw new Error(`Action (${rules['update']}) is not allowed for table (${tableName})`)
                            }

                        }

                    }
                    break
                }  
                case 'delete':{
                    let isActionAllowed = rulesReader(options.rules,rules['exclude'],tableName)

                    if(isActionAllowed){//if is not table excluded from schema
                       
                        tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (_,args,context) => {
                            
                            if(args.__rawGraphQlRequest__){//if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = {...args}
                                args = _
                            }
                            let isActionAllowed = rulesReader(options.rules,context.req,rules['delete'],tableName,context.req)
                            
                            if(isActionAllowed){

                                let rowsToDelete = await db.exec(
                                    injectToSquel( db, db.select().from(tableName), args.filters, args.limit, args.offset, args.order )
                                );
                                
                                if(rowsToDelete && Array.isArray(rowsToDelete)){
                                   
                                    let statementResult = await db.exec( 
                                        db.delete().from(tableName)
                                        .where('id In ?',rowsToDelete.map((row)=>row.id))
                                     );
    
                                    if(statementResult){

                                        if(context.pubsub && statementResult.affectedRows && statementResult.affectedRows>0 && rowsToDelete && rowsToDelete.length>0){//send to subscriptions
    
                                            let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                                            let recursiveStatementResult = await getRecursiveRelationTables(rowsToDelete,relationsFields,tables,db)
                                            
                                            context.pubsub.publish(`${tablesSubscriptionsMethods['delete']}${firstToUpperCase(tableName)}`,{
                                                [`${tablesSubscriptionsMethods['delete']}${firstToUpperCase(tableName)}`]:recursiveStatementResult
                                            })
        
                                        }
        
                                        return {...statementResult,deletedIds:rowsToDelete.map((row)=>row.id)}

                                    }else{
                                        throw new Error(`Error: on ${mutationMethod} from ${tableName}!`)
                                    }
                                }else{
                                    throw new Error(`Error: on get rows to ${mutationMethod} from ${tableName}`)
                                }
                            }else{
                                throw new Error(`Action (${rules['delete']}) is not allowed for table (${tableName})`)
                            }
                            
                        }

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