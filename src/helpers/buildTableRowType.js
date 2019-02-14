import {
    GraphQLObjectType,
    GraphQLNonNull
  } from 'graphql';
import getFieldType from './getFieldType'

const buildTableRowType = (tableName,tableDesc,tablesRowsTypes) =>{

    return new GraphQLObjectType({
        name:tableName.substr(0,tableName.length-1),
        description:'',
        fields: () => {
            let tableFields = {}
            tableDesc.forEach((fieldObject) => {

                if( new RegExp(/\_/ig).test(fieldObject.Field) ){//add table type to this field
                    tableFields[`${fieldObject.Field.split('_')[0]}`] = {type: new GraphQLNonNull(tablesRowsTypes[`${fieldObject.Field.split('_')[0]}`].type)}
                }else{//add graphQl type to this field
                    tableFields[fieldObject.Field] = getFieldType(fieldObject.Type.toLowerCase(),fieldObject.Null.toLowerCase()==='yes' ? true : false)
                }

            })
            return tableFields
        },
    })

}

export default buildTableRowType