import { GraphQLList, GraphQLNonNull } from "graphql";
import buildGraphQlArgs from "./helpers/buildGraphQlArgs";
import { rules, tablesSubscriptionsMethods } from "./helpers/constants";
import rulesReader from "./helpers/rulesReader";
import { firstToUpperCase, pluralToSingular } from "./helpers/textHelpers";

const buildTablesGraphQlSubscriptions = (options, tables, tablesRowTypes) => {
    let tablesSubscriptionsTypes = {};

    tables.forEach(tableObject => {
        let tableName = Object.values(tableObject)[0];
        let tableDesc = Object.values(tableObject)[1];
        let isActionAllowed = rulesReader(options.rules, rules["exclude"], tableName);

        if (isActionAllowed) {
            Object.values(tablesSubscriptionsMethods).forEach(subscriptionMethod => {
                tablesSubscriptionsTypes[`${subscriptionMethod}${firstToUpperCase(tableName)}`] = {
                    name: `${subscriptionMethod}${firstToUpperCase(tableName)}`,
                    description: `Table graphql type for table: ${tableName}`,
                    type: new GraphQLList(new GraphQLNonNull(tablesRowTypes[pluralToSingular(tableName)])),
                    args: {
                        ...buildGraphQlArgs(tableName, tableDesc, "subscription", subscriptionMethod)
                    }
                };
            });
        }
    });

    return {
        tablesSubscriptionsTypes
    };
};

export default buildTablesGraphQlSubscriptions;
