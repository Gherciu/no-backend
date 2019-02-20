const injectToSquel = (db,squel,filters,order,limit) => {

    if(filters){
        filters.forEach((filterStatementObject) => {
            let filterStatementObjectExpresion = db.squel().expr().and( `${filterStatementObject.where.columnName} ${filterStatementObject.where.operator} ?`,filterStatementObject.where.expression )
            if(filterStatementObject.and){
                filterStatementObject.and.forEach((andStatementObject) => {
                    filterStatementObjectExpresion = filterStatementObjectExpresion.and( `${andStatementObject.columnName} ${andStatementObject.operator} ?`,andStatementObject.expression )
                })
            }
            if(filterStatementObject.or){
                filterStatementObject.or.forEach((orStatementObject) => {
                    filterStatementObjectExpresion = filterStatementObjectExpresion.or( `${orStatementObject.columnName} ${orStatementObject.columnName.operator} ?`,orStatementObject.expression )
                })
            }
            squel = squel.where(
                filterStatementObjectExpresion
            )
        })
    }
    if(order){
       order.forEach((orderStatement) => {
            squel = squel.order(orderStatement.key,orderStatement.direction.toLowerCase()==='asc'?true:false)
        })
    }
    if(limit){
        squel = squel.limit(limit)
    }

    return squel

}

export default injectToSquel