import { GraphQLInt } from 'graphql'

const getTablesQueryTypeArgs = ( ) => {
    return {
        args:{
            id: {
                description: 'id of the table row',
                type: GraphQLInt,
            },
        }
    }
}

export default getTablesQueryTypeArgs