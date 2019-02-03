import graphQlError from './graphQlError'

const graphQlErrorMiddleware = (options,error) => {
    
    return (req,res) => {
        
            const stack = new Error().stack
            console.warn(`\n\n---->${error}<-----\n\n`,stack)
            
            res.status(200).json( graphQlError(error) )

    }

}

export default graphQlErrorMiddleware