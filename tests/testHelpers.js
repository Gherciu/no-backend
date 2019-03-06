const connection = {
    driver: "mysql",
    host: "localhost",
    port: "3306",
    user: "root",
    password: "gherciu1",
    database: "test"
};

const fakeGraphQuery = `
{
    products:{
        id
    }
}
`;

module.exports = {
    connection,
    fakeGraphQuery
};
