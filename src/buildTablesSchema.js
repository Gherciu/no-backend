import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull
  } from 'graphql';

import getFieldType from './helpers/getFieldType'
import {tablesSuffix} from './helpers/strings'

const buildQueries = (tables) => {
    let types    = {}//with args
    let rawTypes = {}//without args
    const recursiveRegisterTableType = (tableName,tableDesc) => {
        if( new RegExp(/\_/ig).test(tableName) ){//if is a table with relation(one-to-many)
            console.log("o-t-m",tableName.split('_'))
        }else{

            if(!types[tableName]){//if table is not already in types

                let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
                let hasAddedRelationsTablesToTypes = false
                // relationsFields.forEach((relationFieldObjectItem)=>{//ceck if relation table is in types

                //     if(types[`${relationFieldObjectItem.Field.split('_')[0]}${tablesSuffix}`]){
                //         hasAddedRelationsTablesToTypes = true
                //     }

                // })
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
                    // recursiveRegisterTableType( tableName,tableDesc )//add table initiator to types 

                }else{//register table type to types and raw types

                    let tableType = (withArgs) =>{

                        return new GraphQLObjectType({
                            name:tableName,
                            description:'',
                            fields: () => {
                                let tableFields = {}
                                tableDesc.forEach((fieldObject) => {

                                    if( new RegExp(/\_/ig).test(fieldObject.Field) ){//add table type to this field
                                        // /tableFields[`${fieldObject.Field.split('_')[0]}${tablesSuffix}`] = rawTypes[`${fieldObject.Field.split('_')[0]}${tablesSuffix}`].type
                                    }else{//add graphQl type to this field
                                        tableFields[fieldObject.Field] = getFieldType(fieldObject.Type.toLowerCase(),fieldObject.Null.toLowerCase()==='yes' ? true : false)
                                    }

                                })
                                return tableFields
                            },
                            args:null
                        })

                    }
                    rawTypes[tableName] = {type :new GraphQLNonNull(new GraphQLList( tableType(false) ))}
                    types[tableName]    = {type :new GraphQLNonNull(new GraphQLList( tableType(true) ))}
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
        query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            ...types
        }
        })
    }

}

const buildTablesSchema = async (options,tables,db) => {
    
    let query = await buildQueries(tables)

    return new GraphQLSchema({...query})

}

export default buildTablesSchema