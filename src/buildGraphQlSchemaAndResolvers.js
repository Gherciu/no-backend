import { buildSchema } from 'graphql'
import dbProvider from './dbProvider'
const buildGraphQlSchemaAndResolvers = async (options) => {
    const db = new dbProvider(options)
    console.log(await db.exec('select * from users'))
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