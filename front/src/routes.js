import React from 'react';
import { Router, Route, Switch} from 'react-router';

import TableOfContents from './TableOfContents.jsx';
import TextbookContent from './TextbookContent.jsx';
import FullTextbook from './FullTextbook.jsx';
import CommunityArticle from './CommunityArticle.jsx';
import CommunityNewsletterArchive from './CommunityNewsletterArchive.jsx';
import CommunityNewsletter from './CommunityNewsletter.jsx';

import './css/ContentfulContent.css';


const Routes = (props) => (
  <Router {...props}>
  	<Switch>
	   	<Route path="/textbook" component={FullTextbook} />
	   	<Route path="/contents" component={TableOfContents} />
		<Route path="/chapter/:id" component={TextbookContent} />
		<Route exact path="/community/newsletters" component={CommunityNewsletterArchive}/>
		<Route path="/community/newsletters/:id" component={CommunityNewsletter}/>
		<Route path="/community/:id" component={CommunityArticle}/>
	    <Route path="/:id" component={TextbookContent} />
    </Switch>
  </Router>
);

export default Routes;