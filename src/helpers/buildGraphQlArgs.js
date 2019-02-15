import { GraphQLInt } from 'graphql'

const buildGraphQlArgs = ( ) => {
    return {
        id: {
            description: 'id of the table row',
            type: GraphQLInt,
        }
    }
}

export default buildGraphQlArgs