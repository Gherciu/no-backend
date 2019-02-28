import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import buildTablesGraphQlMutations from './buildTablesGraphQlMutations';
import buildTablesGraphQlQuerys from './buildTablesGraphQlQuerys';
import buildTablesGraphQlRowTypes from './buildTablesGraphQlRowTypes';

const buildGraphQlSchema = async (options,tables,db) => {

    let { tablesRowTypes } = await buildTablesGraphQlRowTypes( tables )
    let { tablesQuerysTypes } = await buildTablesGraphQlQuerys( options,tables,tablesRowTypes )
    let { tablesMutationsTypes } = await buildTablesGraphQlMutations( options,tables )
    let tablesSubscriptionsTypes = {
        somethingChanged:{
            name:'somethingChanged',
            description: `something changed type`,
            type :GraphQLString 
        }
    }

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