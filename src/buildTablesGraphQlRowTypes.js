import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import getFieldGraphQlType from './helpers/getFieldGraphQlType';
import { pluralToSingular, singularToPlural } from './helpers/textHelpers';

const buildTablesGraphQlRowTypes = (tables) => {

    let tablesRowTypes = {}//tables row types
    const recursiveRegisterTableType = (tableName,tableDesc) => {//function why register recursive tables rows to tables rows types 

        if(!tablesRowTypes[pluralToSingular(tableName)]){//if table row is not already in tables rows types

            let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
//<--------------------------------- change this section of code ----------------------------------------->
            let isAddedAllRelationsFieldsToTablesTypes = false
            relationsFields.forEach((relationFieldObjectItem)=>{//ceck if all relation fields(table column) has your type in tables types

                if( tablesRowTypes[relationFieldObjectItem.Field.split('_')[0]] ){//category_id --> category (check if all relations fields has own table row registered to tablesRowTypes)
                    isAddedAllRelationsFieldsToTablesTypes = true
                }

            })
//<-------------------------------------------------------------------------------------------------------->
            if(relationsFields.length > 0 && !isAddedAllRelationsFieldsToTablesTypes){//if table has relations fields

                relationsFields.forEach((relationFieldObjectItem)=>{//register all relations fields(table column) to tables row types (ex:category_id ->> category:{id,name ...})
                    
                    let relationTableDesc = []
                    tables.forEach(tableObjectItem=>{
                        if(/*table name*/Object.values(tableObjectItem)[0]===singularToPlural(relationFieldObjectItem.Field.split('_')[0])){
                            relationTableDesc = Object.values(tableObjectItem)[1]/*table desc*/
                        }
                    })
                    recursiveRegisterTableType( singularToPlural(relationFieldObjectItem.Field.split('_')[0]),relationTableDesc )

                })
                recursiveRegisterTableType( tableName,tableDesc )//add table recursive initiator to tables types 

            }else{//register tables row to tables row types

                tablesRowTypes[pluralToSingular(tableName)] = new GraphQLObjectType({
                    name:pluralToSingular(tableName),
                    description:`Table row graphql type for table : ${tableName}`,
                    fields: () => {
                        let tableFields = {}
                        tableDesc.forEach((tableDescObject) => {
            
                            if( new RegExp(/\_/ig).test(tableDescObject.Field) ){//add table type to this field
                                tableFields[`${tableDescObject.Field.split('_')[0]}`] = {type: new GraphQLNonNull( tablesRowTypes[`${tableDescObject.Field.split('_')[0]}`] )}
                            }else{//add graphQl type to this field (table column)
                                tableFields[tableDescObject.Field] = getFieldGraphQlType(tableDescObject.Type.toLowerCase(),tableDescObject.Null.toLowerCase()==='yes' ? true : false)
                            }
            
                        })
                        return tableFields
                    }
                })
            
            }

        }
    }
    tables.forEach((tableObject) => {
        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        recursiveRegisterTableType(tableName,tableDesc)
    })

    return {
        tablesRowTypes
    }

}

export default buildTablesGraphQlRowTypes