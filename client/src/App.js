import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//import the necessary packages 
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from "@apollo/client"
import { setContext } from '@apollo/client/link/context';

//create link for graph ql operations
const httpLink = createHttpLink({
  uri: '/graphql',
});

//gives the headers to grphql
const authLink = setContext((_, { headers})=>{
  const token = localStorage.getItem('id_token');
  return{
    headers: {
      ...headers,
      authorization:token ? `Bearer ${token}`: '',
    },
  };
});

//sets up the apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

//pulls in apollo provider and takes in client
function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
