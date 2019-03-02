
import { rules, tablesMutationsMethods, tablesSubscriptionsMethods } from './helpers/constants';
import getInsertIds from './helpers/getInsertIds';
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

                    if(isActionAllowed){
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
                                
                                if(context.pubsub && statementResult && getInsertIds(statementResult).length>0){//send to subscriptions
                                    
                                    let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                                    let insertRows = await db.exec(
                                        db.select()
                                        .from(tableName)
                                        .where('id IN ?',getInsertIds(statementResult))
                                    )
                                    let recursiveStatementResult = await getRecursiveRelationTables(insertRows,relationsFields,tables,db)
                                    
                                    context.pubsub.publish(`${tablesSubscriptionsMethods['insert']}${firstToUpperCase(tableName)}`,{
                                        [`${tablesSubscriptionsMethods['insert']}${firstToUpperCase(tableName)}`]:recursiveStatementResult
                                    })

                                }

                                return {...statementResult,insertIds:getInsertIds(statementResult)}

                            }else{
                                throw new Error(`Action (${rules['insert']}) is not allowed for table (${tableName})`)
                            }
                        }
                        
                    }
                    break
                }  
                case 'update':{
                    let isActionAllowed = rulesReader(options.rules,rules['exclude'],tableName)

                    if(isActionAllowed){
                        tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (_,args,context) => {
                            
                            if(args.__rawGraphQlRequest__){//if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = {...args}
                                args = _
                            }
                            let isActionAllowed = rulesReader(options.rules,rules['update'],tableName,context.req)
                            
                            if(isActionAllowed){
                                
                                let squel = db.update().table(tableName).setFields(args.newValue)
                                squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )
                                let statementResult = await db.exec( squel )

                                if(context.pubsub && statementResult){//send to subscriptions

                                    let squel = db.select().from(tableName)
                                    squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )
                                    let updatedRows = await db.exec( squel )

                                    if(updatedRows && updatedRows.length>0){

                                        let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                                        let recursiveStatementResult = await getRecursiveRelationTables(updatedRows,relationsFields,tables,db)
                                        
                                        context.pubsub.publish(`${tablesSubscriptionsMethods['update']}${firstToUpperCase(tableName)}`,{
                                            [`${tablesSubscriptionsMethods['update']}${firstToUpperCase(tableName)}`]:recursiveStatementResult
                                        })

                                    }

                                }

                                return {...statementResult}
                            }else{
                                throw new Error(`Action (${rules['update']}) is not allowed for table (${tableName})`)
                            }
                        }

                    }
                    break
                }  
                case 'delete':{
                    let isActionAllowed = rulesReader(options.rules,rules['exclude'],tableName)

                    if(isActionAllowed){
                       
                        tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (_,args,context) => {
                            
                            if(args.__rawGraphQlRequest__){//if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = {...args}
                                args = _
                            }
                            let isActionAllowed = rulesReader(options.rules,context.req,rules['delete'],tableName,context.req)
                            
                            if(isActionAllowed){

                                let rowsToDelete = await db.exec(
                                    injectToSquel( db.select().from(tableName),args.filters,args.limit,args.offset,args.order )
                                )
                                console.log(rowsToDelete)
                                // let squel = db.delete().from(tableName)
                                // squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )
                                // let statementResult = await db.exec( squel )

                                // if(context.pubsub && rowsToDelete && rowsToDelete.length>0){//send to subscriptions

                                //     let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                                //     let recursiveStatementResult = await getRecursiveRelationTables(rowsToDelete,relationsFields,tables,db)
                                    
                                //     context.pubsub.publish(`${tablesSubscriptionsMethods['delete']}${firstToUpperCase(tableName)}`,{
                                //         [`${tablesSubscriptionsMethods['delete']}${firstToUpperCase(tableName)}`]:recursiveStatementResult
                                //     })

                                // }

                                // return {...statementResult}
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