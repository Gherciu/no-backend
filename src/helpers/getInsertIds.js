const getInsertIds = (statementResult) => {
    let insertIds = []
    if(statementResult.insertId>0){
        for (let i = statementResult.insertId; i < (statementResult.insertId+statementResult.affectedRows); i++) {
            insertIds.push(i)
        }
    }
    return insertIds
}

export default getInsertIds