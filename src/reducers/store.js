import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './index';

/**
 * Prepare the Redux Store
 */
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(
  reducers,
  undefined,
  compose(
    composeWithDevTools({
      name: 'ALterflo',
    })
  )
);

export default store;
