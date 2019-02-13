import { GraphQLList,GraphQLNonNull,GraphQLObjectType } from 'graphql'
import { tablesSuffix } from './strings'
import buildTableRowType from './buildTableRowType'
import { singularToPlural,pluralToSingular } from './textHelpers'

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
                relationsFields.forEach((relationFieldObjectItem)=>{//ceck if relation table is in types

                    if(tablesTypes[`${relationFieldObjectItem.Field.split('_')[0]}${tablesSuffix}`]){
                        hasAddedRelationsTablesToTypes = true
                    }

                })
                if(relationsFields.length > 0 && !hasAddedRelationsTablesToTypes){//if has relations fields (many-to-one)

                    relationsFields.forEach((relationFieldObjectItem)=>{//add all relationsFields --> tables to types

                        let relationTableDesc = []
                        tables.forEach(tableObjectItem=>{
                            if(/*tableName*/Object.values(tableObjectItem)[0]===relationFieldObjectItem.Field.split('_')[0]){
                                relationTableDesc = Object.values(tableObjectItem)[1]/*table desc*/
                            }
                        })
                        recursiveRegisterTableType(`${relationFieldObjectItem.Field.split('_')[0]}${tablesSuffix}`,relationTableDesc)

                    })
                    recursiveRegisterTableType( tableName,tableDesc )//add table initiator to types 

                }else{//register table type to types and row types

                    tablesRowsTypes[tableName.substr(0,tableName.length-1)] = {type : buildTableRowType(tableName,tableDesc,tablesRowsTypes) }//singular row type
                    tablesTypes[tableName] = {type :new GraphQLNonNull(new GraphQLList( tablesRowsTypes[tableName.substr(0,tableName.length-1)].type ))}//plural table type
                
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