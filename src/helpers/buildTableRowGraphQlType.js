import {
    GraphQLObjectType,
    GraphQLNonNull
  } from 'graphql';
import getColumnGraphQlType from './getColumnGraphQlType'
import {pluralToSingular} from './textHelpers'

const buildTableRowGraphQlType = (tableName,tableDesc,tablesRowsTypes) =>{

    return new GraphQLObjectType({
        name:pluralToSingular(tableName),
        description:`Table row graphql type for table : ${tableName}`,
        fields: () => {
            let tableColumns = {}
            tableDesc.forEach((fieldObject) => {

                if( new RegExp(/\_/ig).test(fieldObject.Field) ){//add table type to this field
                    tableColumns[`${fieldObject.Field.split('_')[0]}`] = {type: new GraphQLNonNull(tablesRowsTypes[`${fieldObject.Field.split('_')[0]}`].type)}
                }else{//add graphQl type to this field (table column)
                    tableColumns[fieldObject.Field] = getColumnGraphQlType(fieldObject.Type.toLowerCase(),fieldObject.Null.toLowerCase()==='yes' ? true : false)
                }

            })
            return tableColumns
        },
    })

}

export default buildTableRowGraphQlType