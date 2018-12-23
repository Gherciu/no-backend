var { buildSchema } = require('graphql');

const noBackendDb = (options)=>{ 

    this.options = options || {}

    this.getSchema = () => {

        const schema = buildSchema(`
            type Query {
                hello: String
            }
        `);

        return schema;

   } 

    this.getRootValue = () => {

        const rootValue = {
            hello : () => {
                return 'Hello world!';
            }
        }

        return rootValue;

    } 

   return this;
   
}

module.exports = noBackendDb;