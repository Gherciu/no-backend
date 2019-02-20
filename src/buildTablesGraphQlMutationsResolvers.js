
import { tablesMutationsMethods } from './helpers/constants'
import { firstToUpperCase } from './helpers/textHelpers'

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
                        if(statementResult){
                            let insertIds = []
                            for (let i = statementResult.insertId; i < (statementResult.insertId+statementResult.affectedRows); i++) {
                                insertIds.push(i)
                            }
                           
                            return await db.exec(
                                db.select()
                                .from(tableName)
                                .where(`id IN ( ${insertIds.join(',')} )`)
                            )
                        }else{
                            throw new Error(`Error on insert new items in ${tableName}!`)
                        }
                        
                    }
                    break
                }  
                case 'update':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async () => {
                
                    }
                    break
                }  
                case 'delete':{
                    tablesMutationsResolvers[`${mutationMethod}${firstToUpperCase(tableName)}`] = async () => {
                
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