import buildTablesSchema from './buildTablesSchema'
import { graphql, buildSchema } from 'graphql'
import renderGraphiql from './renderGraphiql'

const middleware = (options) => {
    
    const tablesSchema = buildTablesSchema(options)
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
  
    return (req,res) => {
        if(req.method === 'POST'){
            graphql(schema, req.body.query , resolvers)
                .then((response) => {
                    //send data or errors to client 
                    res.status(200).json(response)
                });
        }else if(req.method === 'GET'){
            if(options.graphiql){
                //if graghiql is enabled send this
                res.status(200).send(renderGraphiql(options,req))
            }else{
                //if graghiql is disabled send bad request type
                res.status(400).send('GET requests to this route is not allowed!')
            }
        }else{
            //if request method is not GET or POST
            res.status(400).send(`This request method  is not allowed !`)
        } 
    }

}

export default middleware