const filesMiddleware = (options)=>{
    return (req,res)=>{
        res.json(options)
    }
}

export default filesMiddleware