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
            tableDesc.forEach((tableDescObject) => {

                if( new RegExp(/\_/ig).test(tableDescObject.Field) ){//add table type to this field
                    tableColumns[`${tableDescObject.Field.split('_')[0]}`] = {type: new GraphQLNonNull(tablesRowsTypes[`${tableDescObject.Field.split('_')[0]}`].type)}
                }else{//add graphQl type to this field (table column)
                    tableColumns[tableDescObject.Field] = getColumnGraphQlType(tableDescObject.Type.toLowerCase(),tableDescObject.Null.toLowerCase()==='yes' ? true : false)
                }

            })
            return tableColumns
        },
    })

}

export default buildTableRowGraphQlType