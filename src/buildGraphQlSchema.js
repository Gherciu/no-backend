import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations';
import buildTablesGraphQlQuerys from './buildTablesGraphQlQuerys';
import buildTablesGraphQlRowTypes from './buildTablesGraphQlRowTypes';

const buildGraphQlSchema = async (options,tables,db) => {

    let { tablesRowTypes } = await buildTablesGraphQlRowTypes( tables )
    let { tablesQuerysTypes } = await buildTablesGraphQlQuerys( options,tables,tablesRowTypes )
    let { tablesMutationsTypes } = await buildTablesGraphQlMutations( options,tables )

    return {
        schema: new GraphQLSchema({ 
            query: new GraphQLObjectType({
                name: 'Query',
                description:'GraphQl root query type',
                fields: {
                    ...tablesQuerysTypes
                }
            }),
            mutation:new GraphQLObjectType({
                name: 'Mutation',
                description:'GraphQl root mutation type',
                fields: {
                    ...tablesMutationsTypes
                }
            })
        }),
        tablesRowTypes,
        tablesQuerysTypes,
        tablesMutationsTypes
    }

}

export default buildGraphQlSchema