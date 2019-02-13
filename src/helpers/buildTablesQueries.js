import { GraphQLList,GraphQLNonNull,GraphQLObjectType } from 'graphql'
import buildTableRowType from './buildTableRowType'
import { singularToPlural,pluralToSingular } from './textHelpers'
import getTablesQueryTypeArgs from './getTablesQueryTypeArgs'

const buildTablesQueries = (tables) => {

    let tablesTypes  = {}//tables types with args
    let tablesRowsTypes = {}//tables row types
    const recursiveRegisterTableType = (tableName,tableDesc) => {

        if( new RegExp(/\_/ig).test(tableName) ){//if is a table with relation(one-to-many)
            console.log("o-t-m",tableName.split('_'))
        }else{

            if(!tablesTypes[tableName]){//if table is not already in types

                let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                let hasAddedRelationsTablesToTypes = false
                relationsFields.forEach((relationFieldObjectItem)=>{//ceck if relation table is in tables types

                    if( tablesTypes[singularToPlural(relationFieldObjectItem.Field.split('_')[0])] ){
                        hasAddedRelationsTablesToTypes = true
                    }

                })
                if(relationsFields.length > 0 && !hasAddedRelationsTablesToTypes){//if table has relations fields (many-to-one)

                    relationsFields.forEach((relationFieldObjectItem)=>{//register all relations fields to tables types (ex:category_id->>categorys table type)

                        let relationTableDesc = []
                        tables.forEach(tableObjectItem=>{
                            if(/*tableName*/Object.values(tableObjectItem)[0]===relationFieldObjectItem.Field.split('_')[0]){
                                relationTableDesc = Object.values(tableObjectItem)[1]/*table desc*/
                            }
                        })
                        recursiveRegisterTableType( singularToPlural(relationFieldObjectItem.Field.split('_')[0]),relationTableDesc )

                    })
                    recursiveRegisterTableType( tableName,tableDesc )//add table initiator to types 

                }else{//register table type to types and row types

                    tablesRowsTypes[pluralToSingular(tableName)] = {type : buildTableRowType(tableName,tableDesc,tablesRowsTypes) }//singular row type
                    tablesTypes[tableName] = {
                        type :new GraphQLNonNull(new GraphQLList( tablesRowsTypes[pluralToSingular(tableName)].type )),
                        ...getTablesQueryTypeArgs()
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
        query:{
            query: new GraphQLObjectType({
                name: 'Query',
                fields: {
                    ...tablesTypes
                }
            })
        },
        tablesRowsTypes
    }

}

export default buildTablesQueries