import fs from 'fs'
import path from 'path'
import { graphql } from 'graphql'
import renderGraphiQl from './renderGraphiQl'
import { graphiQlScriptUrlGetParamName, graphiQlScriptPath } from './strings'

const graphQlMiddleware = ( options,schema,resolvers ) => {

    return (req,res,next) => {

        if(req.path === options.route){

            if(req.method === 'POST'){
                graphql(schema, req.body.query , resolvers)
                    .then((response) => {
                        //send data or errors to client 
                        res.status(200).json(response)
                    });
            }else if(req.method === 'GET'){
                if(options.graphiql){
                    if(req.query[graphiQlScriptUrlGetParamName]){
                        //if graphiql is enabled adn req type is get and req query : graphiQlScriptUrlGetParamName is true
                        res.status(200).send( fs.readFileSync( path.join(__dirname,graphiQlScriptPath) ) )
                    }else{
                        //if graghiql is enabled and req type is get send this
                        res.status(200).send(renderGraphiQl(options,req))
                    }
                }else{
                    //if graghiql is disabled and req type is get send bad request type
                    res.status(400).send('GET requests to this route is not allowed!')
                }
            }else{
                //if request method is not GET or POST
                res.status(400).send(`This request method  is not allowed !`)
            } 

        }else{

            next()

        }

    }

}

export default graphQlMiddleware