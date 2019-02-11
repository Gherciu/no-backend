import { buildSchema } from 'graphql'

const buildGraphQlSchemaAndResolvers = async (options) => {
    const schema = await buildSchema(`
        type Query {
            hello: String
        }`
    );
    
    const resolvers = await {
        hello: () => {
             return 'Hello world!';
        }
    };

    return {
        schema,
        resolvers
    }

}

export default buildGraphQlSchemaAndResolvers