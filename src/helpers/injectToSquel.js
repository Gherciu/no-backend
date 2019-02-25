const injectToSquel = (db,squel,filters,limit,offset,order) => {

    if(filters){
            filters.forEach((filterStatementObject) => {
                let filterStatementObjectExpresion = db.squel().expr()
                
                if(filterStatementObject.andIn){
                    filterStatementObject.andIn.forEach((andInStatementObject) => {
                        filterStatementObjectExpresion = filterStatementObjectExpresion.and( `${andInStatementObject.columnName} IN ?`,andInStatementObject.values )
                    })
                }
                if(filterStatementObject.orIn){
                    filterStatementObject.orIn.forEach((orInStatementObject) => {
                        filterStatementObjectExpresion = filterStatementObjectExpresion.or( `${orInStatementObject.columnName} IN ?`,orInStatementObject.values )
                    })
                }
                if(filterStatementObject.and){
                    filterStatementObject.and.forEach((andStatementObject) => {
                        filterStatementObjectExpresion = filterStatementObjectExpresion.and( `${andStatementObject.columnName} ${andStatementObject.operator} ?`,andStatementObject.expression )
                    })
                }
                if(filterStatementObject.or){
                    filterStatementObject.or.forEach((orStatementObject) => {
                        filterStatementObjectExpresion = filterStatementObjectExpresion.or( `${orStatementObject.columnName} ${orStatementObject.operator} ?`,orStatementObject.expression )
                    })
                }
                squel = squel.where(
                    filterStatementObjectExpresion
                )
            })
        }
        if(order){
           order.forEach((orderStatement) => {
                squel = squel.order(orderStatement.columnName,orderStatement.direction.toLowerCase()==='asc'?true:false)
            })
        }
        if(limit){
            squel = squel.limit(limit)
        }
        if(offset){
            if(!limit){//offset without limit dont work more info(https://dev.mysql.com/doc/refman/8.0/en/select.html#id4651990)
                squel = squel.limit(/*some large number*/999999)
            }
            squel = squel.offset(offset)
        }
    
        return squel

}

export default injectToSquel