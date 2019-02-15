import { isPlural,singularToPlural } from './helpers/textHelpers'

const tablesValidator = (tables) => {

    let validatorMessage = false

    tables.forEach((tableObject) => {
        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]

        if(!isPlural(tableName))
            validatorMessage = `The name of table: ${tableName} is incorect it must be in the plural (ex: ${tableName}--> ${singularToPlural(tableName)})`
    })

    return validatorMessage

}

export default tablesValidator