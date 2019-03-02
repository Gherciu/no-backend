const getInseretIds = (statementResult) => {
    let inseretIds = []
    if(statementResult.insertId>0){
        for (let i = statementResult.insertId; i < (statementResult.insertId+statementResult.affectedRows); i++) {
            inseretIds.push(i)
        }
    }
    return inseretIds
}

export default getInseretIds