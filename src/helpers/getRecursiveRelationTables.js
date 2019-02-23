import {singularToPlural,pluralToSingular} from './textHelpers'

const getRecursiveRelationTables = async (statementResult,relationsFields,tables,db) => {

    let result = [...statementResult]

    if(relationsFields.length > 0){

        for (let i = 0; i < relationsFields.length; i++) {

            let relationFieldName = relationsFields[i].Field/*ex:(category_id) */
            let relationFieldTableName =/*table name*/ singularToPlural( relationFieldName.split('_')[0] )/*categorys*/

            let relationFieldTableDesc = tables.filter((tableObject) => {
                let tableObjectTableName = /*table name*/ Object.values(tableObject)[0]
                return tableObjectTableName === relationFieldTableName
            })
            relationFieldTableDesc = /*table desc*/ Object.values(relationFieldTableDesc[0])[1]

            let currentRelationsFields = relationFieldTableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
            let statementResultRowsIdsForCurrentRelationField = []

            result.forEach((item)=> {
                statementResultRowsIdsForCurrentRelationField.push(item[relationFieldName])
            })

            let currentStatementResult = await db.exec( db.select().from(relationFieldTableName).where('id IN ?',statementResultRowsIdsForCurrentRelationField) )
                currentStatementResult = await getRecursiveRelationTables( currentStatementResult,currentRelationsFields,tables,db )
            
            result = result.map((statementResultObject) => {//add currentStatementResult to statementResult ex:( { id:1,name:"test",...,category:{id:1,title:"aaa",...,shop:{...}}} and more recursive)

                let newStatementResultObject = {...statementResultObject}

                newStatementResultObject[pluralToSingular(relationFieldTableName)] = currentStatementResult.filter((item) => {
                    return  statementResultObject[relationFieldName] === item.id 
                })[0]

                return newStatementResultObject

            })
            
        }
       
    }

    return result

}

export default getRecursiveRelationTables