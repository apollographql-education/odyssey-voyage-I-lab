const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./locations.graphql', { encoding: 'utf-8' }));
const resolvers = require('./resolvers');
const LocationsAPI = require('./datasources/LocationsApi.js');

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const port = process.env.PORT || 4001;
  const subgraphName = 'locations';

  try {
    const { url } = await startStandaloneServer(server, {
      context: async () => {
        return {
          dataSources: {
            locationsAPI: new LocationsAPI(),
          },
        };
      },
      listen: { port },
    });
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  } catch (err) {
    console.log(err);
  }
}

startApolloServer();
