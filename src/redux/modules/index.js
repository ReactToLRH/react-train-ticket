import { combineReducers } from 'redux-immutable';
import home from './home';
import query from './query';
import ticket from './ticket';
import order from './order';

const rootReducer = combineReducers({
  home,
  query,
  ticket,
  order
});

export default rootReducer;
