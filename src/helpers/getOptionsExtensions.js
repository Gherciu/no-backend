import { extensions } from "./constants";

const getOptionsExtensions = (options, { extensionName, extensionPartName, tablesRowTypes, db }) => {
    let extension = {};

    if (options.extend) {
        if (extensionName === extensions["query"] && options.extend[extensions["query"]]) {
            for (let [queryExtKey, queryExtVal] of Object.entries(options.extend[extensions["query"]])) {
                if (typeof queryExtVal === "function") {
                    extension[queryExtKey] = queryExtVal(tablesRowTypes);
                } else {
                    extension[queryExtKey] = queryExtVal;
                }
            }
        }
        if (extensionName === extensions["mutation"] && options.extend[extensions["mutation"]]) {
            for (let [mutationExtKey, mutationExtVal] of Object.entries(options.extend[extensions["mutation"]])) {
                if (typeof mutationExtVal === "function") {
                    extension[mutationExtKey] = mutationExtVal(tablesRowTypes);
                } else {
                    extension[mutationExtKey] = mutationExtVal;
                }
            }
        }
        if (extensionName === extensions["subscription"] && options.extend[extensions["subscription"]]) {
            for (let [subscriptionExtKey, subscriptionExtVal] of Object.entries(options.extend[extensions["subscription"]])) {
                if (typeof subscriptionExtVal === "function") {
                    extension[subscriptionExtKey] = subscriptionExtVal(tablesRowTypes);
                } else {
                    extension[subscriptionExtKey] = subscriptionExtVal;
                }
            }
        }
        if (extensionName === extensions["resolvers"]._name && options.extend[extensions["resolvers"]._name]) {
            if (extensionPartName === extensions["resolvers"].query && options.extend[extensions["resolvers"]._name][extensions["resolvers"].query]) {
                //query resolvers
                let rebuildedResolvers = {};

                for (let [resolverKey, resolverValue] of Object.entries(
                    options.extend[extensions["resolvers"]._name][extensions["resolvers"].query]
                )) {
                    if (typeof resolverValue === "function") {
                        rebuildedResolvers[resolverKey] = (_, args, context, info) => {
                            if (args.__rawGraphQlRequest__) {
                                //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = { ...args };
                                args = _;
                            }
                            return resolverValue(_, args, context ? { ...context, connection: db.pool } : {}, info);
                        };
                    } else {
                        rebuildedResolvers[resolverKey] = resolverValue;
                    }

                    extension = rebuildedResolvers;
                }
            }
            if (
                extensionPartName === extensions["resolvers"].mutation &&
                options.extend[extensions["resolvers"]._name][extensions["resolvers"].mutation]
            ) {
                //mutation resolvers
                let rebuildedResolvers = {};

                for (let [resolverKey, resolverValue] of Object.entries(
                    options.extend[extensions["resolvers"]._name][extensions["resolvers"].mutation]
                )) {
                    if (typeof resolverValue === "function") {
                        rebuildedResolvers[resolverKey] = (_, args, context, info) => {
                            if (args.__rawGraphQlRequest__) {
                                //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = { ...args };
                                args = _;
                            }
                            return resolverValue(_, args, context ? { ...context, connection: db.pool } : {}, info);
                        };
                    } else {
                        rebuildedResolvers[resolverKey] = resolverValue;
                    }

                    extension = rebuildedResolvers;
                }
            }
            if (
                extensionPartName === extensions["resolvers"].subscription &&
                options.extend[extensions["resolvers"]._name][extensions["resolvers"].subscription]
            ) {
                //subscription resolvers
                let rebuildedResolvers = {};

                for (let [resolverKey, resolverValue] of Object.entries(
                    options.extend[extensions["resolvers"]._name][extensions["resolvers"].subscription]
                )) {
                    if (typeof resolverValue === "object" && resolverValue.subscription && typeof resolverValue.subscription === "function") {
                        rebuildedResolvers[resolverKey] = {
                            resolve: resolverValue.resolve,
                            subscribe: (_, args, context, info) => {
                                if (args.__rawGraphQlRequest__) {
                                    //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                    context = { ...args };
                                    args = _;
                                }
                                return resolverValue.subscription(_, args, context ? { ...context, connection: db.pool } : {}, info);
                            }
                        };
                    } else {
                        rebuildedResolvers[resolverKey] = resolverValue;
                    }

                    extension = rebuildedResolvers;
                }
            }
        }
    }

    return extension;
};

export default getOptionsExtensions;
