import {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLScalarType,
    GraphQLString
} from "graphql";
import { Kind } from "graphql/language";
import { filterTypeArgs, tablesSubscriptionsMethods } from "./constants";
import getFieldGraphQlType from "./getFieldGraphQlType";
import { firstToUpperCase, pluralToSingular } from "./textHelpers";

const expressionType = new GraphQLScalarType({
    name: "expression",
    description: "The `expression` scalar type represents a string,number or boolean.",
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return parseInt(ast.value);
        } else if (ast.kind === Kind.FLOAT) {
            return parseFloat(ast.value);
        } else if (ast.kind === Kind.BOOLEAN) {
            return ast.value;
        } else if (ast.kind === Kind.STRING) {
            return ast.value.toString();
        } else {
            throw new TypeError("`expression`: Expected type Int,Float or String, found other type!");
        }
    }
});
const whereInType = new GraphQLInputObjectType({
    name: "whereInStatement",
    description: 'whereInStatement GraphQl type, usage ex:({ columnName:"id",values:[1,2,3,4] })',
    fields: {
        columnName: { type: new GraphQLNonNull(GraphQLString) },
        values: { type: new GraphQLList(new GraphQLNonNull(expressionType)) }
    }
});
const whereType = new GraphQLInputObjectType({
    name: "whereStatement",
    description: 'whereStatement GraphQl type, usage ex:({ columnName:"id",clause:"< 3" })',
    fields: {
        columnName: { type: new GraphQLNonNull(GraphQLString) },
        operator: { type: new GraphQLNonNull(GraphQLString) },
        expression: { type: new GraphQLNonNull(expressionType) }
    }
});
const filtersArgs = {
    filters: {
        type: new GraphQLList(
            new GraphQLNonNull(
                new GraphQLInputObjectType({
                    name: "filter",
                    fields: {
                        [filterTypeArgs["andIn"]]: { type: new GraphQLList(new GraphQLNonNull(whereInType)) },
                        [filterTypeArgs["orIn"]]: { type: new GraphQLList(new GraphQLNonNull(whereInType)) },
                        [filterTypeArgs["and"]]: { type: new GraphQLList(new GraphQLNonNull(whereType)) },
                        [filterTypeArgs["or"]]: { type: new GraphQLList(new GraphQLNonNull(whereType)) }
                    }
                })
            )
        )
    }
};
const orderArgs = {
    order: {
        type: new GraphQLList(
            new GraphQLNonNull(
                new GraphQLInputObjectType({
                    name: "orderStatement",
                    fields: {
                        columnName: { type: new GraphQLNonNull(GraphQLString) },
                        direction: { type: new GraphQLNonNull(GraphQLString) }
                    }
                })
            )
        )
    }
};
const buildGraphQlArgs = (tableName, tableDesc, argumentsFor, argumentsForMethod) => {
    let args = {};

    if (argumentsFor === "mutation") {
        switch (argumentsForMethod) {
            case "insert": {
                args = {
                    [tableName]: {
                        type: new GraphQLNonNull(
                            new GraphQLList(
                                new GraphQLNonNull(
                                    new GraphQLInputObjectType({
                                        name: `new${firstToUpperCase(pluralToSingular(tableName))}`,
                                        description: `Table row graphql type for table : ${tableName}`,
                                        fields: () => {
                                            let fields = {};
                                            tableDesc.forEach(tableDescObject => {
                                                if (tableDescObject.Field !== "id") {
                                                    fields[tableDescObject.Field] = getFieldGraphQlType(
                                                        tableDescObject.Type.toLowerCase(),
                                                        tableDescObject.Null.toLowerCase() === "yes" ? true : false
                                                    );
                                                }
                                            });
                                            return fields;
                                        }
                                    })
                                )
                            )
                        )
                    }
                };
                break;
            }
            case "update": {
                args = {
                    ["newValue"]: {
                        type: new GraphQLNonNull(
                            new GraphQLInputObjectType({
                                name: `updated${firstToUpperCase(pluralToSingular(tableName))}`,
                                description: `Table row graphql type for table : ${tableName}`,
                                fields: () => {
                                    let fields = {};
                                    tableDesc.forEach(tableDescObject => {
                                        if (tableDescObject.Field !== "id") {
                                            fields[tableDescObject.Field] = getFieldGraphQlType(
                                                tableDescObject.Type.toLowerCase(),
                                                tableDescObject.Null.toLowerCase() === "yes" ? true : false
                                            );
                                        }
                                    });
                                    return fields;
                                }
                            })
                        )
                    },
                    ...filtersArgs,
                    ...orderArgs,
                    limit: { type: GraphQLInt }
                };
                break;
            }
            case "delete": {
                args = {
                    ...filtersArgs,
                    ...orderArgs,
                    limit: { type: GraphQLInt }
                };
                break;
            }
            default: {
                throw new TypeError("Error:Undefined (argumentsForMethod) type on mutations!");
            }
        }
    }
    if (argumentsFor === "query") {
        args = {
            ...filtersArgs,
            ...orderArgs,
            offset: { type: GraphQLInt },
            limit: { type: GraphQLInt }
        };
    }
    if (argumentsFor === "subscription") {
        switch (argumentsForMethod) {
            case tablesSubscriptionsMethods["insert"]: {
                args = {
                    ...filtersArgs
                };
                break;
            }
            case tablesSubscriptionsMethods["delete"]: {
                args = {
                    ...filtersArgs
                };
                break;
            }
            case tablesSubscriptionsMethods["update"]: {
                args = {
                    ...filtersArgs
                };
                break;
            }
            default: {
                throw new TypeError("Error:Undefined (argumentsForMethod) type on subscriptions");
            }
        }
    }

    return {
        ...args
    };
};

export default buildGraphQlArgs;
