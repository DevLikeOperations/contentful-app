import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import createHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker';
import './css/index.css';

ReactDOM.render(
 <Routes history={createHistory()} />
	, document.getElementById('root'));
registerServiceWorker();
