const noBackend = require("./../dist/index");
const { graphql } = require("graphql");
const { connection, getProductsQuery } = require("./testHelpers");

test("Happy Path", async () => {
    expect.assertions(2);
    const result = await noBackend({
        connection
    });
    expect(result).toEqual(
        expect.objectContaining({
            typeDefs: expect.any(String),
            schema: expect.any(Object),
            resolvers: expect.any(Object),
            tablesQuerysResolvers: expect.any(Object),
            tablesMutationsResolvers: expect.any(Object),
            tablesSubscriptionsResolvers: expect.any(Object)
        })
    );
    const graphResponse = await graphql(
        result.schema,
        getProductsQuery(),
        {
            ...result.tablesQuerysResolvers,
            ...result.tablesMutationsResolvers,
            ...result.tablesSubscriptionsResolvers
        },
        { __rawGraphQlRequest__: true },
        null,
        null
    );
    expect(graphResponse).toEqual(
        expect.objectContaining({
            data: expect.objectContaining({
                products: expect.any(Array)
            })
        })
    );
});
