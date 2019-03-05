import { comparisonOperators, filterTypeArgs } from "./constants";

const filtersValidator = (payload, filterMethod, filterValue) => {
    let isPayloadValid = true;
    if (payload && typeof payload === "object") {
        if (filterMethod === filterTypeArgs["andIn"]) {
            for (const filterValueObjectItem of filterValue) {
                let columnName = filterValueObjectItem.columnName;
                let columnValue = payload[columnName];
                let values = filterValueObjectItem.values;
                if (values.filter(value => value === columnValue).length === 0) {
                    isPayloadValid = false;
                    break;
                }
            }
        }
        if (filterMethod === filterTypeArgs["orIn"]) {
            let isMinOneStatementValid = false;
            for (const filterValueObjectItem of filterValue) {
                let columnName = filterValueObjectItem.columnName;
                let columnValue = payload[columnName];
                let values = filterValueObjectItem.values;
                if (values.filter(value => value === columnValue).length > 0) {
                    //if one of "orIn statement" match the payload
                    isMinOneStatementValid = true;
                    break;
                }
            }
            if (!isMinOneStatementValid) {
                isPayloadValid = false;
            }
        }
        if (filterMethod === filterTypeArgs["and"]) {
            for (const filterValueObjectItem of filterValue) {
                let columnName = filterValueObjectItem.columnName;
                let columnValue = payload[columnName];
                let operator = filterValueObjectItem.comparisonOperator;
                let expression = filterValueObjectItem.expression;
                if (operator === comparisonOperators["eq"].name) {
                    if (columnValue !== expression) {
                        isPayloadValid = false;
                        break;
                    }
                }
                if (operator === comparisonOperators["notEq"].name) {
                    if (columnValue === expression) {
                        isPayloadValid = false;
                        break;
                    }
                }
                if (operator === comparisonOperators["gt"].name) {
                    if (columnValue < expression) {
                        isPayloadValid = false;
                        break;
                    }
                }
                if (operator === comparisonOperators["lt"].name) {
                    if (columnValue > expression) {
                        isPayloadValid = false;
                        break;
                    }
                }
                if (operator === comparisonOperators["gtOrEq"].name) {
                    if (columnValue < expression) {
                        isPayloadValid = false;
                        break;
                    }
                }
                if (operator === comparisonOperators["ltOrEq"].name) {
                    if (columnValue > expression) {
                        isPayloadValid = false;
                        break;
                    }
                }
            }
        }
        if (filterMethod === filterTypeArgs["or"]) {
            let isMinOneStatementValid = false;
            for (const filterValueObjectItem of filterValue) {
                let columnName = filterValueObjectItem.columnName;
                let columnValue = payload[columnName];
                let operator = filterValueObjectItem.comparisonOperator;
                let expression = filterValueObjectItem.expression;
                if (operator === comparisonOperators["eq"].name) {
                    if (columnValue === expression) {
                        isMinOneStatementValid = true;
                        break;
                    }
                }
                if (operator === comparisonOperators["notEq"].name) {
                    if (columnValue !== expression) {
                        isMinOneStatementValid = true;
                        break;
                    }
                }
                if (operator === comparisonOperators["gt"].name) {
                    if (columnValue > expression) {
                        isMinOneStatementValid = true;
                        break;
                    }
                }
                if (operator === comparisonOperators["lt"].name) {
                    if (columnValue < expression) {
                        isMinOneStatementValid = true;
                        break;
                    }
                }
                if (operator === comparisonOperators["gtOrEq"].name) {
                    if (columnValue >= expression) {
                        isMinOneStatementValid = true;
                        break;
                    }
                }
                if (operator === comparisonOperators["ltOrEq"].name) {
                    if (columnValue <= expression) {
                        isMinOneStatementValid = true;
                        break;
                    }
                }
                if (!isMinOneStatementValid) {
                    isPayloadValid = false;
                }
            }
        }
    }
    return isPayloadValid;
};
const matchFilters = (payload, { filters }) => {
    let payloadMatchFilters = true;
    let payloadValue = payload && Object.values(payload);
    payloadValue = payloadValue[0];

    if (payloadValue && Array.isArray(payloadValue) && filters) {
        if (Array.isArray(filters)) {
            let breackCheck1 = false;
            let breackCheck2 = false;
            for (let payloadValueItem of payloadValue) {
                for (let filterObject of filters) {
                    //breackCheck1
                    for (let [filterObjectItemKey, filterObjectItemValue] of Object.entries(filterObject)) {
                        //breackCheck2
                        if (
                            !filtersValidator(
                                payloadValueItem,
                                filterTypeArgs[filterObjectItemKey],
                                filterObjectItemValue
                            )
                        ) {
                            payloadMatchFilters = false;
                            breackCheck2 = true;
                            break;
                        }
                    }
                    if (breackCheck2) break;
                }
                if (breackCheck1) break;
            }
        } else {
            throw new TypeError(
                `Error: arg (filters) is ${typeof filters} but it must be an array --> on fn:matchFilters!`
            );
        }
    }

    return payloadMatchFilters;
};

export default matchFilters;
