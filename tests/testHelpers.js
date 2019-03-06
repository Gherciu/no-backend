const connection = {
    driver: "mysql",
    host: "localhost",
    port: "3306",
    user: "root",
    password: "gherciu1",
    database: "test"
};

const getProductsQuery = () => {
    return `query{
        products{
            id
        }
    }`;
};

module.exports = {
    connection,
    getProductsQuery
};
