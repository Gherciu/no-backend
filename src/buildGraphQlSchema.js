import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations';
import buildTablesGraphQlQuerys from './buildTablesGraphQlQuerys';
import buildTablesGraphQlRowTypes from './buildTablesGraphQlRowTypes';
import buildTablesGraphQlSubscriptions from './buildTablesGraphQlSubscriptions';

const buildGraphQlSchema = async (options,tables,db) => {

    let { tablesRowTypes } = await buildTablesGraphQlRowTypes( tables )
    let { tablesQuerysTypes } = await buildTablesGraphQlQuerys( options,tables,tablesRowTypes )
    let { tablesMutationsTypes } = await buildTablesGraphQlMutations( options,tables )
    let { tablesSubscriptionsTypes } = await buildTablesGraphQlSubscriptions( options,tables,tablesRowTypes )
    
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
            }),
            subscription:new GraphQLObjectType({
                name: 'Subscription',
                description:'GraphQl root subscription type',
                fields: {
                    ...tablesSubscriptionsTypes
                }
            })
        }),
        tablesRowTypes,
        tablesQuerysTypes,
        tablesMutationsTypes,
        tablesSubscriptionsTypes
    }

}

export default buildGraphQlSchema