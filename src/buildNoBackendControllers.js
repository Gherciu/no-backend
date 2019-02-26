import { graphql } from 'graphql';
import renderGraphiQlStorm from './renderGraphiQlStorm';

const buildNoBackendControllers = async ( options,schema,resolvers ) => {

    const noBackendExpressController = ( req,res,next ) => {

        if( req.method === 'POST' ){
//<--------------------------------- read this section an update the code ------------------------------->
            /**
             * P.S maybe I missed something😅
                In apollo and rest servers in resolvers parameter 1 is root 2 is args 3 is context but in graphql function 
                first parameter is args 2 (resolvers|context) this is diferent and need modifications
                How to possible fix this:
                1.update or add other version of graphql
                2.Aka (kostili) change the parameters structure in all resolvers (😓my way) __rawGraphQlRequest__
                  to know that this request is being executed by raw graphql
            */
//<------------------------------------------------------------------------------------------------------>
            graphql( schema,req.body.query,resolvers,{req,__rawGraphQlRequest__:true},req.body.variables )
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