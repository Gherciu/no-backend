const errorMiddleware = (options,error) => {
    
    return (req,res) => {
        const stack = new Error().stack
        console.warn(`\n\n---->${error}<-----\n\n`,stack)
        res.status(500).send('Server error!')
    }

}

export default errorMiddleware