import React from 'react';
import { Router, Route, Switch} from 'react-router';

import TableOfContents from './TableOfContents.jsx';
import Subsection from './Subsection.jsx';
import Chapter from './Chapter.jsx';
import FullTextbook from './FullTextbook.jsx';

import './ContentfulComponent.css';


const Routes = (props) => (
  <Router {...props}>
  	<Switch>
	   	<Route path="/textbook" component={FullTextbook} />
	   	<Route path="/contents" component={TableOfContents} />
		<Route path="/chapter/:id" component={Chapter} />
	    <Route path="/:id" component={Subsection} />
    </Switch>
  </Router>
);

export default Routes;