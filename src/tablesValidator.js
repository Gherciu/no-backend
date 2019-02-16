import { isPlural,singularToPlural } from './helpers/textHelpers'

const tablesValidator = (tables) => {

    let validatorMessage = false

    tables.forEach((tableObject) => {
        
        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]

        if(!isPlural(tableName))//if table name is not at plural
            validatorMessage = `The name of table: ${tableName} is incorect it must be in the plural (ex: ${tableName}--> ${singularToPlural(tableName)})`
        if(new RegExp(/\_/ig).test(tableName) && tableName.split('_').filter((tableNamePart)=>!isPlural(tableNamePart)))//if is a relation table  && table name is not at plural
            validatorMessage = `The name of table: ${tableName} is incorect it must be in the plural (ex: ${tableName}--> ${tableName.split('_').map((tableNamePart)=>singularToPlural(tableNamePart).join('_'))})`
        if(new RegExp(/(\-|\+|\%|\/|\=|\.)/ig).test(tableName))//if table name contain not allowed symbols
            validatorMessage = `The name of table: ${tableName} is incorect this contain not allowed sybols (- , %, +, =, /, ., ...) please use only words and numbers, and for relation tables use this format (tableName_otherTableName ex: products_categorys)`

    })

    return validatorMessage

}

export default tablesValidator