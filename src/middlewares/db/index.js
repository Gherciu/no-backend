const db = (options)=>{
    return (req,res)=>{
        res.json(options)
    }
}

export default db