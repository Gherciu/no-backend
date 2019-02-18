import { GraphQLList,GraphQLNonNull } from 'graphql'
import buildTableRowGraphQlType from './helpers/buildTableRowGraphQlType'
import { singularToPlural,pluralToSingular } from './helpers/textHelpers'

const buildTablesGraphQlTypes = (tables) => {

    let tablesTypes  = {}//tables types with args 
    let tablesRowTypes = {}//tables row types
    const recursiveRegisterTableType = (tableName,tableDesc) => {//function why register tables to (tables types with args) and tables rows to tables rows types 

        if( new RegExp(/\_/ig).test(tableName) ){//if is a table with relation(one-to-many)
            console.log("o-t-m",tableName.split('_'))
        }else{

            if(!tablesTypes[tableName]){//if table is not already in tables types

                let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                let hasAddedRelationsTablesToTypes = false
                relationsFields.forEach((relationFieldObjectItem)=>{//ceck if all relation fields(table column) has your type in tables types

                    if( tablesTypes[singularToPlural(relationFieldObjectItem.Field.split('_')[0])] ){
                        hasAddedRelationsTablesToTypes = true
                    }

                })
                if(relationsFields.length > 0 && !hasAddedRelationsTablesToTypes){//if table has relations fields (many-to-one)

                    relationsFields.forEach((relationFieldObjectItem)=>{//register all relations fields(table column) to tables types (ex:category_id ->> categorys:[category]!)

                        let relationTableDesc = []
                        tables.forEach(tableObjectItem=>{
                            if(/*tableName*/Object.values(tableObjectItem)[0]===relationFieldObjectItem.Field.split('_')[0]){
                                relationTableDesc = Object.values(tableObjectItem)[1]/*table desc*/
                            }
                        })
                        recursiveRegisterTableType( singularToPlural(relationFieldObjectItem.Field.split('_')[0]),relationTableDesc )

                    })
                    recursiveRegisterTableType( tableName,tableDesc )//add table recursive initiator to tables types 

                }else{//register table type to tables types and tables row to tables row types

                    tablesRowTypes[pluralToSingular(tableName)] = buildTableRowGraphQlType(tableName,tableDesc,tablesRowTypes) //singular row type
                    tablesTypes[tableName] = {
                        name:tableName,
                        description: `Table graphql type for table: ${tableName}`,
                        type :new GraphQLNonNull( new GraphQLList( new GraphQLNonNull( tablesRowTypes[pluralToSingular(tableName)] ) ) ),
                    }//plural table type
                
                }
            }

        }
    }
    tables.forEach((tableObject) => {
        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        recursiveRegisterTableType(tableName,tableDesc)
    })

    return {
        tablesTypes
    }

}

export default buildTablesGraphQlTypes