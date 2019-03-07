import { extensions } from "./constants";

const getOptionsExtensions = (options, extensionName) => {
    let extension = {};

    if (options.extend) {
        if (extensionName === extensions["query"] && options.extend[extensions["query"]]) {
            extension = options.extend[extensions["query"]];
        }
        if (extensionName === extensions["mutation"] && options.extend[extensions["mutation"]]) {
            extension = options.extend[extensions["mutation"]];
        }
        if (extensionName === extensions["subscription"] && options.extend[extensions["subscription"]]) {
            extension = options.extend[extensions["subscription"]];
        }
        if (extensionName === extensions["resolvers"] && options.extend[extensions["resolvers"]]) {
            let rebuildedResolvers = {};

            for (let [resolverKey, resolverValue] of Object.entries(options.extend[extensions["resolvers"]])) {
                if (typeof resolverValue === "function") {
                    rebuildedResolvers[resolverKey] = (_, args, context, info) => {
                        if (args.__rawGraphQlRequest__) {
                            //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                            context = { ...args };
                            args = _;
                        }
                        return resolverValue(_, args, context, info);
                    };
                } else if (
                    typeof resolverValue === "object" &&
                    resolverValue.subscription &&
                    typeof resolverValue.subscription === "function"
                ) {
                    rebuildedResolvers[resolverKey] = {
                        resolve: resolverValue.resolve,
                        subscribe: (_, args, context, info) => {
                            if (args.__rawGraphQlRequest__) {
                                //if is a raw graphql request read more in file(buildNoBackendControllers.js)
                                context = { ...args };
                                args = _;
                            }
                            return resolverValue.subscription(_, args, context, info);
                        }
                    };
                } else {
                    rebuildedResolvers[resolverKey] = resolverValue;
                }

                extension = rebuildedResolvers;
            }
        }
    }

    return extension;
};

export default getOptionsExtensions;
