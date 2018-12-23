var { buildSchema } = require('graphql');

const noBackendDb = (options)=>{ 

    this.options = options || {}

    this.getSchema = () => {

        const schema = buildSchema(`
            type Message {
               content:String
            }
            type Query {
                getMessage: Message,
                getAnswer: Message,
            }
            type Mutation {
               setMessage(content:String):Message
            }
        `);

        return schema;

   } 

    this.getRootValue = () => {

        const rootValue = {
            getMessage : () => {
                return {
                    content: 'Hello world'
                };
            },
            getAnswer : () => {
                return {
                    content: 'Hello world'
                };
            },
            setMessage : ({content}) => {
                return {
                    content:content
                };
            }
        }

        return rootValue;

    } 

   return this;
   
}

module.exports = noBackendDb;