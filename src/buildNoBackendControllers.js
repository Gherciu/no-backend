import { graphql } from 'graphql';
import renderGraphiQlStorm from './renderGraphiQlStorm';

const buildNoBackendControllers = async ( options,schema,resolvers ) => {

    const noBackendExpressController = ( req,res,next ) => {

        if( req.method === 'POST' ){

            graphql( schema,req.body.query,resolvers,{_noBackendRequestContext:req},req.body.variables )
            .then((response) => {
                //send data or errors to client 
                res.status(200).json(response)
            });

        }else if( req.method === 'GET' ){

            if(options.graphiql_storm){
                //if graghiql is enabled and req type is get send this
                res.status(200).send(renderGraphiQlStorm(options,`${req.protocol}://${req.get('host')}${req.originalUrl}`))
            }else{
                //if graghiql is disabled and req type is get send bad request type
                res.status(400).send('GET requests to this route is not allowed!')
            }

        }else{

            //if request method is not GET or POST
            res.status(400).send(`This request method  is not allowed !`)
            
        } 

    }

    return {
        noBackendExpressController
    }

}

export default buildNoBackendControllers