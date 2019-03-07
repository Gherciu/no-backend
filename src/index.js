import { printSchema } from "graphql";
import buildGraphQlResolvers from "./buildGraphQlResolvers";
import buildGraphQlSchema from "./buildGraphQlSchema";
import buildNoBackendControllers from "./buildNoBackendControllers";
import dbProvider from "./helpers/dbProvider";
import optionsValidator from "./optionsValidator";
import tablesValidator from "./tablesValidator";

const noBackend = async options => {
    const optionsValidatorMessage = optionsValidator(options);

    if (optionsValidatorMessage) {
        throw new TypeError(optionsValidatorMessage);
    } else {
        const db = new dbProvider(options);
        const tables = await db.exec("show tables");

        for (let i = 0; i < tables.length; i++) {
            //get tables desc
            let tableName = Object.values(tables[i])[0];
            tables[i] = { ...tables[i], desc: await db.exec(`desc ${tableName}`) };
        }
        const tablesValidatorMessage = tablesValidator(tables);

        if (tablesValidatorMessage) {
            throw new TypeError(tablesValidatorMessage);
        } else {
            let {
                schema,
                tablesQuerysTypes,
                tablesMutationsTypes,
                tablesSubscriptionsTypes,
                tablesRowTypes
            } = await buildGraphQlSchema(options, tables, db);
            let {
                resolvers,
                tablesQuerysResolvers,
                tablesMutationsResolvers,
                tablesSubscriptionsResolvers
            } = await buildGraphQlResolvers(options, tables, db);
            let { noBackendExpressController } = await buildNoBackendControllers(options, schema, {
                ...tablesQuerysResolvers,
                ...tablesMutationsResolvers,
                ...tablesSubscriptionsResolvers
            }); //for raw graphql request read more in file(buildNoBackendControllers.js)

            return {
                //ready controllers for different frameworks
                noBackendExpressController,
                //tables row types
                tablesRowTypes,
                //tables queries & tables mutations & tables subscriptions --> schema
                schema,
                typeDefs: printSchema(schema), //schema in string format
                tablesQuerysTypes,
                tablesMutationsTypes,
                tablesSubscriptionsTypes,
                //tables queries resolvers & tables mutations resolvers & tables subscriptions resolvers --> resolvers
                resolvers,
                tablesQuerysResolvers,
                tablesMutationsResolvers,
                tablesSubscriptionsResolvers,
                //providers
                db
            };
        }
    }
};

export default noBackend;
