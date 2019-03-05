const noBackend = require("./../dist/index");
const { GraphQLSchema } = require("graphql");
const { connection } = require("./testHelpers");

test("Happy Path", async () => {
    expect.assertions(1);
    const result = await noBackend({
        connection
    });
    expect(result).toEqual(
        expect.objectContaining({
            typeDefs: expect.any(String)
        })
    );
});
