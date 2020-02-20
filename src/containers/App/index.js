import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './style.css';

import Home from '../Home';

const App = function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
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
