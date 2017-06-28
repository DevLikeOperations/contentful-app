import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Routes from './routes';
import createHistory from 'history/createBrowserHistory'


import ContentfulComponent from './ContentfulComponent.jsx';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
 <Routes history={createHistory()} />
	, document.getElementById('root'));
registerServiceWorker();
