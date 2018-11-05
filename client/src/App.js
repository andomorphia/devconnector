import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';

import './App.scss';

import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';

// Check for token
const token = localStorage.jwtToken;

if (token) {
  // Set auth token header auth
  setAuthToken(token);

  // Decode token an get user info
  const decoded = jwtDecode(token);

  // Set current user
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now / 1000;

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // TODO: clear current profile
  }
}

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </div>
        <Footer />
      </div>
    </Router>
  </Provider>
);

export default App;
