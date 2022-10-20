const {ApolloServer} = require('@apollo/server');
const {startStandaloneServer} = require('@apollo/server/standalone');
const {ApolloGateway} = require('@apollo/gateway');
require('dotenv').config();

const gateway = new ApolloGateway();

async function startApolloServer() {
  const server = new ApolloServer({
    gateway
  });

  const port = process.env.PORT || 4000;

  try {
    const {url} = await startStandaloneServer(server, {
      listen: {port}
    });
    console.log(`🚀 Gateway ready at ${url}`);
  } catch (err) {
    console.log(err);
  }
}

startApolloServer();
