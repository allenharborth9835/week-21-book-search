const express = require('express');

//import the necessary packages
const { ApolloServer } = require('apollo-server-express');
const {authMiddleware} = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas')

const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

//start apollo server with type defs, resolvers, and authMiddleware
const startServer = async () =>{
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  //start server and apply middle ware to app
  await server.start();
  server.applyMiddleware({ app });

  //gives link to tests routes
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

//call start server
startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
