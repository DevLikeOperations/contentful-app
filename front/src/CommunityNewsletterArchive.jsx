import React, { Component } from 'react';
import axios from 'axios';
import './ContentfulContent.css';
import { Link } from 'react-router-dom';

export default class CommunityNewsletterArchive extends Component {

	state ={
		newsletters : []
	}

	componentDidMount(){
		axios.get('/api/community/newsletters').then(res => {
					const newsletters = res.data;
					this.setState({newsletters});
				}).catch(e =>{
					console.log(e);	
				});
	}


  	render() {
		const renderedContents = [];

		this.state.newsletters.forEach(function(newsletter){
			const route = '/community/newsletters/' + newsletter.id;
			const newsletterLink = <li> <Link to={route}> {newsletter.title} </Link></li>;
			renderedContents.push(newsletterLink);
		});


		return (
			<div className="community contentfulContainer">
				<h2>Newsletters</h2>
				<div id="textbookContentContainer">
					<ul>
						{renderedContents}
					</ul>
				</div>
			</div>
		);
	}
}

