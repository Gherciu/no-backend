import { GraphQLList, GraphQLNonNull } from 'graphql';
import buildGraphQlArgs from './helpers/buildGraphQlArgs';
import { pluralToSingular } from './helpers/textHelpers';

const buildTablesGraphQlQuerys = (tables,tablesRowTypes) => {

    let tablesQuerysTypes = {}

    tables.forEach((tableObject) => {
        
        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
            
        tablesQuerysTypes[tableName] = {
            name:tableName,
            description: `Table graphql type for table: ${tableName}`,
            type : new GraphQLList( new GraphQLNonNull( tablesRowTypes[pluralToSingular(tableName)] ) ),
            args: {
                ...buildGraphQlArgs(tableName,tableDesc,'query')
            }
        }

    })

    return {
        tablesQuerysTypes
    }

}

export default buildTablesGraphQlQuerys