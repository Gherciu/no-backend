import buildTablesGraphQlMutationsResolvers from './buildTablesGraphQlMutationsResolvers';
import buildTablesGraphQlQuerysResolvers from './buildTablesGraphQlQuerysResolvers';

const buildGraphQlResolvers = async (options,tables,db) => {
    
    let { tablesQuerysResolvers } = await buildTablesGraphQlQuerysResolvers(options,tables,db)
    let { tablesMutationsResolvers } = await buildTablesGraphQlMutationsResolvers(options,tables,db)
    let tablesSubscriptionsResolvers = {
        somethingChanged: {
            subscribe: (_,args,context) => {
                setInterval(() => context.pubsub.publish('something_changed', { somethingChanged:'nother subscription result' }), 2000)
                return context.pubsub.asyncIterator(['something_changed'])
            },
        }
    }

    return {
        resolvers:{
            Query:{
                ...tablesQuerysResolvers
            },
            Mutation:{
                ...tablesMutationsResolvers
            },
            Subscription:{
                ...tablesSubscriptionsResolvers
            }
        },
        tablesQuerysResolvers,
        tablesMutationsResolvers,
        tablesSubscriptionsResolvers
    }

}

export default buildGraphQlResolvers