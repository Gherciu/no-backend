
import {isEmpty} from './helpers/objectsHelpers'
import {singularToPlural} from './helpers/textHelpers'

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        
        tablesQuerysResolvers[tableName] = async (root,args,context) => {

            if(isEmpty(root)){//if no input args

                let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))

                if(relationsFields.length>0){//if table have relations fields 
//use then and return an promise
                    // let statementResult = await db.exec( db.select().from(tableName) )
                    
                    // await statementResult.map(async (statementResultObject)=>{
                    //     let newStatementResultObject = {...statementResultObject}

                    //     await relationsFields.forEach(async (relationFieldObjectItem) => {
                    //         let relationFieldObjectItemTableName = singularToPlural(relationFieldObjectItem.Field.split('_')[0])
                    //         let newStatementResult = await db.exec( db.select().from(relationFieldObjectItemTableName).limit(1) )
                    //         newStatementResultObject[relationFieldObjectItemTableName] = {
                    //             ...newStatementResult[0]
                    //         }
                    //         console.log(newStatementResult)
                    //     })

                    //     return newStatementResultObject
                    // })
                    // return statementResult
                }else{
                    return await db.exec( db.select().from(tableName) )
                }

                return statementResult

            }else{//if input args

            }

        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers