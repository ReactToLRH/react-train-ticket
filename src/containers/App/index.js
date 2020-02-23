import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './style.css';

import Home from '../Home';
import Query from '../Query';
import Ticket from '../Ticket';
import Order from '../Order';

const App = function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/order" component={Order} />
          <Route path="/ticket" component={Ticket} />
          <Route path="/query" component={Query} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
