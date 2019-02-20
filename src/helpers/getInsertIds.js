const getInsertIds = (statementResult) => {
    let insertIds = []
    for (let i = statementResult.insertId; i < (statementResult.insertId+statementResult.affectedRows); i++) {
        insertIds.push(i)
    }
    return insertIds
}

export default getInsertIds