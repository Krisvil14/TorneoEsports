import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/reset.css';
import '../styles/variables.css';

//import your own components
import Layout from './layout';

//render your react application
ReactDOM.render(<Layout />, document.querySelector('#app'));
