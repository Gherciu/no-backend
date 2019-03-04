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
