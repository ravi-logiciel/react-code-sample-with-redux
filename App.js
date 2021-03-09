import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

import AppRoutes from './AppRoutes';
import reducersStore from './reducers/store';

/**
 * App Component
 */
function App() {
  return (
    <Provider store={reducersStore}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

window.onunload = () => {
  const rememberMe = store.get('remember_me');

  if (rememberMe == true) return;

  store.clearAll();
};

export default App;
