import { buildSchema } from 'graphql'

const buildGraphQlSchemaAndResolvers = (options) => {

    const schema = buildSchema(`
        type Query {
            hello: String
        }`
    );
    const resolvers = {
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