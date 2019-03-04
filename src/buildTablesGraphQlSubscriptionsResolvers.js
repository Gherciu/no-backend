import { rules, tablesSubscriptionsMethods } from "./helpers/constants";
import matchFilters from "./helpers/matchFilters";
import rulesReader from "./helpers/rulesReader";
import { firstToUpperCase } from "./helpers/textHelpers";

const buildTablesGraphQlSubscriptionsResolvers = async (options, tables) => {
    let tablesSubscriptionsResolvers = {};

    tables.forEach(tableObject => {
        let tableName = Object.values(tableObject)[0];
        let tableDesc = Object.values(tableObject)[1];

        Object.values(tablesSubscriptionsMethods).forEach(subscriptionMethod => {
            switch (subscriptionMethod) {
                case "onInsert": {
                    let isActionAllowed = rulesReader(options.rules, rules["exclude"], tableName);

                    if (isActionAllowed) {
                        tablesSubscriptionsResolvers[`${subscriptionMethod}${firstToUpperCase(tableName)}`] = {
                            subscribe: (_, args, context, info) => {
                                if (args.__rawGraphQlRequest__) {
                                    //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                    context = { ...args };
                                    args = _;
                                }
                                let isActionAllowed = rulesReader(
                                    options.rules,
                                    rules["insert"],
                                    tableName,
                                    context.req
                                );

                                if (isActionAllowed) {
                                    if (context.pubsub && context.withFilter) {
                                        let asyncIterator = context.withFilter(() => {
                                            return context.pubsub.asyncIterator([
                                                `${subscriptionMethod}${firstToUpperCase(tableName)}`
                                            ]);
                                        }, matchFilters);
                                        return asyncIterator(_, args, context, info);
                                    } else {
                                        throw new Error(
                                            "Error: pubsub or withFilter is undefined, please add an instance of pubsub to context and add withFilter function to context!"
                                        );
                                    }
                                } else {
                                    throw new Error(
                                        `Action (${rules["insert"]}) is not allowed for table (${tableName})`
                                    );
                                }
                            }
                        };
                    }
                    break;
                }
                case "onUpdate": {
                    let isActionAllowed = rulesReader(options.rules, rules["exclude"], tableName);

                    if (isActionAllowed) {
                        tablesSubscriptionsResolvers[`${subscriptionMethod}${firstToUpperCase(tableName)}`] = {
                            subscribe: (_, args, context) => {
                                if (args.__rawGraphQlRequest__) {
                                    //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                    context = { ...args };
                                    args = _;
                                }
                                let isActionAllowed = rulesReader(
                                    options.rules,
                                    rules["update"],
                                    tableName,
                                    context.req
                                );

                                if (isActionAllowed) {
                                    if (context.pubsub && context.withFilter) {
                                        let asyncIterator = context.withFilter(() => {
                                            return context.pubsub.asyncIterator([
                                                `${subscriptionMethod}${firstToUpperCase(tableName)}`
                                            ]);
                                        }, matchFilters);
                                        return asyncIterator(_, args, context, info);
                                    } else {
                                        throw new Error(
                                            "Error: pubsub or withFilter is undefined, please add an instance of pubsub to context and add withFilter function to context!"
                                        );
                                    }
                                } else {
                                    throw new Error(
                                        `Action (${rules["update"]}) is not allowed for table (${tableName})`
                                    );
                                }
                            }
                        };
                    }
                    break;
                }
                case "onDelete": {
                    let isActionAllowed = rulesReader(options.rules, rules["exclude"], tableName);

                    if (isActionAllowed) {
                        tablesSubscriptionsResolvers[`${subscriptionMethod}${firstToUpperCase(tableName)}`] = {
                            subscribe: (_, args, context) => {
                                if (args.__rawGraphQlRequest__) {
                                    //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                    context = { ...args };
                                    args = _;
                                }
                                let isActionAllowed = rulesReader(
                                    options.rules,
                                    rules["delete"],
                                    tableName,
                                    context.req
                                );

                                if (isActionAllowed) {
                                    if (context.pubsub && context.withFilter) {
                                        let asyncIterator = context.withFilter(() => {
                                            return context.pubsub.asyncIterator([
                                                `${subscriptionMethod}${firstToUpperCase(tableName)}`
                                            ]);
                                        }, matchFilters);
                                        return asyncIterator(_, args, context, info);
                                    } else {
                                        throw new Error(
                                            "Error: pubsub or withFilter is undefined, please add an instance of pubsub to context and add withFilter function to context!"
                                        );
                                    }
                                } else {
                                    throw new Error(
                                        `Action (${rules["delete"]}) is not allowed for table (${tableName})`
                                    );
                                }
                            }
                        };
                    }
                    break;
                }
                default: {
                    throw new TypeError("Error: Undefined subscription method");
                }
            }
        });
    });

    return {
        tablesSubscriptionsResolvers
    };
};

export default buildTablesGraphQlSubscriptionsResolvers;
