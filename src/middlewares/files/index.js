const files = (options)=>{
    return (req,res)=>{
        res.json(options)
    }
}

export default files