
import { tablesMutationsMethods } from './helpers/constants'
import { firstToUpperCase } from './helpers/textHelpers'
import getInsertIds from './helpers/getInsertIds'
import injectToSquel from './helpers/injectToSquel'

const buildTablesGraphQlMutationsResolvers = async (options,tables,db) => {

    let tablesMutationsResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]

        tablesMutationsMethods.forEach((mutationMethod) => {

            switch (mutationMethod) {
                case 'insert':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async ( root,args,context ) => {

                        let statementResult = await db.exec(
                            db.insert()
                            .into(tableName)
                            .setFieldsRows(
                                root[tableName]
                            )   
                        )

                        return {...statementResult,insertIds:getInsertIds(statementResult)}
                        
                    }
                    break
                }  
                case 'update':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (root,args,context) => {
                        
                        let squel = db.update().table(tableName).setFields(root.newValue)
                        squel = injectToSquel( db,squel,root.filters,root.order,root.limit )
                        let statementResult = await db.exec( squel )

                        return {...statementResult,insertIds:getInsertIds(statementResult)}

                    }
                    break
                }  
                case 'delete':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async (root,args,context) => {
                
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