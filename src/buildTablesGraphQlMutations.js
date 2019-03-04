import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import buildGraphQlArgs from "./helpers/buildGraphQlArgs";
import { rules, tablesMutationsMethods } from "./helpers/constants";
import rulesReader from "./helpers/rulesReader";
import { firstToUpperCase } from "./helpers/textHelpers";

const statementResultType = new GraphQLObjectType({
  name: "statementResult",
  description: "Statement result",
  fields: {
    affectedRows: { type: GraphQLInt },
    changedRows: { type: GraphQLInt },
    insertId: { type: GraphQLInt },
    fieldCount: { type: GraphQLInt },
    warningCount: { type: GraphQLInt },
    message: { type: GraphQLString },
    inseretIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    deletedIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) },
    updatedIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLInt)) }
  }
});
const buildTablesGraphQlMutations = (options, tables) => {
  let tablesMutationsTypes = {};

  tables.forEach(tableObject => {
    let tableName = Object.values(tableObject)[0];
    let tableDesc = Object.values(tableObject)[1];
    let isActionAllowed = rulesReader(
      options.rules,
      rules["exclude"],
      tableName
    );

    if (isActionAllowed) {
      tablesMutationsMethods.forEach(mutationMethod => {
        tablesMutationsTypes[
          `${mutationMethod}${firstToUpperCase(tableName)}`
        ] = {
          name: `${mutationMethod}${firstToUpperCase(tableName)}`,
          description: `Table graphql type for table: ${tableName}`,
          type: statementResultType,
          args: {
            ...buildGraphQlArgs(
              tableName,
              tableDesc,
              "mutation",
              mutationMethod
            )
          }
        };
      });
    }
  });

  return {
    tablesMutationsTypes
  };
};

export default buildTablesGraphQlMutations;
