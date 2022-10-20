const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./activities.graphql', { encoding: 'utf-8' }));
const resolvers = require('./resolvers');
const ActivitiesAPI = require('./datasources/ActivitiesApi.js');

async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const port = process.env.PORT || 4003;
  const subgraphName = 'activities';

  try {
    const { url } = await startStandaloneServer(server, {
      context: async () => {
        return {
          dataSources: {
            activitiesAPI: new ActivitiesAPI(),
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
