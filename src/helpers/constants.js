export const tablesMutationsMethods = ["insert", "update", "delete"];
export const tablesSubscriptionsMethods = {
    update: "onUpdate",
    delete: "onDelete",
    insert: "onInsert"
};
export const tablesPluralSuffix = "s";
export const rules = {
    read: "_read",
    update: "_update",
    delete: "_delete",
    insert: "_insert",
    exclude: "_exclude"
};
export const filterTypeArgs = {
    and: "and",
    or: "or",
    andIn: "andIn",
    orIn: "orIn"
};
export const comparisonOperators = {
    eq: {
        name: "Equal",
        value: "=",
        description: "Returns true if the operands are equal."
    },
    notEq: {
        name: "NotEqual",
        value: "!=",
        description: "Returns true if the operands are not equal."
    },
    gt: {
        name: "GreaterThan",
        value: ">",
        description: "Returns true if the left operand is greater than the right operand."
    },
    lt: {
        name: "LessThan",
        value: "<",
        description: "Returns true if the left operand is less than the right operand."
    },
    gtOrEq: {
        name: "GreaterThanOrEqual",
        value: ">=",
        description:
            "Returns true if the left operand is greater than the right operand or Returns true if the operands are equal."
    },
    ltOrEq: {
        name: "LessThanOrEqual",
        value: "<=",
        description:
            "Returns true if the left operand is less than the right operand or Returns true if the operands are equal."
    }
};
export const extensions = {
    query: "Query",
    mutation: "Mutation",
    subscription: "Subscription",
    resolvers: {
        _name: "Resolvers",
        query: "Query",
        mutation: "Mutation",
        subscription: "Subscription"
    }
};
