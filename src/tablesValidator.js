import { isPlural, isSingular, pluralToSingular, singularToPlural } from "./helpers/textHelpers";

const tablesValidator = tables => {
    let validatorMessage = false;

    tables.forEach(tableObject => {
        let tableName = Object.values(tableObject)[0];
        let tableDesc = Object.values(tableObject)[1];

        if (!isPlural(tableName)) {
            //if table name is not at plural (Bad: product, Good: products)
            validatorMessage = `The name of table: ${tableName} is incorect it must be in the plural (ex: ${tableName}--> ${singularToPlural(
                tableName
            )}).Please rename or _exclude this table from schema!`;
        }

        if (
            new RegExp(/\_/gi).test(tableName) &&
            tableName.split("_").filter(tableNamePart => !isPlural(tableNamePart)).length > 0
        ) {
            //if is a relation table  && table name is not at plural (Bad: product_category, Good: products_categorys)
            validatorMessage = `The name of table: ${tableName} is incorect it must be in the plural (ex: ${tableName}--> ${tableName
                .split("_")
                .map(tableNamePart =>
                    singularToPlural(isSingular(tableNamePart) ? tableNamePart : pluralToSingular(tableNamePart))
                )
                .join("_")} .Please rename or _exclude this table from schema!`;
        }

        if (new RegExp(/(\-|\+|\%|\/|\=|\.)/gi).test(tableName)) {
            //if table name contain not allowed symbols
            validatorMessage = `The name of table: ${tableName} is incorect this contain not allowed sybols (- , %, +, =, /, ., ...) please use only words and numbers, and for relation tables use this format (tableName_otherTableName ex: products_categorys).Please rename or _exclude this table from schema!`;
        }
        for (let fieldObject of tableDesc) {
            //table fields validatore
            if (new RegExp(/\_/gi).test(fieldObject.Field) && fieldObject.Field.split("_").length > 2) {
                //(Bad relationField name:category_product_id, Good relationField name:category_id, otherRelation_id)
                validatorMessage = `The name of field ${
                    fieldObject.Field
                } is incorect in table: ${tableName} (for relations fields is allowed maximum one underscore "_" ex:(category_id)).Please rename this field or _exclude this table from schema!`;
                break;
            }
            if (
                new RegExp(/\_/gi).test(fieldObject.Field) &&
                fieldObject.Field.split("_").filter(fieldNamePart => isPlural(fieldNamePart)).length > 0
            ) {
                //(Bad relationField name:categorys_id, Good relationField name:category_id) //no plural for relations fields
                validatorMessage = `The name of field ${
                    fieldObject.Field
                } is incorect in table: ${tableName} (for relations fields is not allowed name in plural format ex(Bad name:categorys_id, Good:category_id)).Please rename this field or _exclude this table from schema!`;
                break;
            }
        }
    });

    return validatorMessage;
};

export default tablesValidator;
