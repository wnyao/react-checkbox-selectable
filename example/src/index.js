import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import CheckboxSelectable from 'CheckboxSelectable';
import CheckboxSelectableV2 from 'CheckboxSelectableV2';

const renderer = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

if (module.hot) module.hot.accept(Component => renderer());
renderer();
