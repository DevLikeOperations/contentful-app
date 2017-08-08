import React, { Component } from 'react';
import axios from 'axios';
import './ContentfulContent.css';
import { Link } from 'react-router-dom';
import './newsletters2.css';

export default class CommunityNewsletterArchive extends Component {

	state ={
		newsletters : {}
	}

	componentDidMount(){
		axios.get('/api/community/blah').then(res => {
					const newsletters = res.data;
					this.setState({newsletters});
				}).catch(e =>{
					console.log(e);	
				});
	}


  	render() {
		const renderedContents = [];

		/*
		this.state.newsletters.forEach(function(newsletter){
			const route = '/community/newsletters/' + newsletter.id;
			const newsletterLink = <li> <Link to={route}> {newsletter.title} </Link></li>;
			renderedContents.push(newsletterLink);
		});
		*/

 return (
	<div className="community contentfulContainer">
    <h1>Newsletters</h1>
      <section className="container">
      	<NewsletterSection newslettersByYear={this.state.newsletters}> </NewsletterSection>
      </section>
 	</div>
    );
	}
}


class NewsletterSection extends React.Component {

	constructor(props) {
		super(props);
		
	}
	render() {

		const monthNames = ["January", "February", "March", "April", "May", "June",
  					"July", "August", "September", "October", "November", "December"
		];
		const years = this.props.newslettersByYear;

		const renderedSections = Object.keys(years).map(function(year, count){

			const tag = `ac-${year}`;

			const newslettersByMonth = years[year];

			const renderedSubsections = Object.keys(newslettersByMonth).map(function(month, count){
				const subtag = `${tag}-${count}`;

				const newsletters = newslettersByMonth[month];
				const newsletterLinks = newsletters.map(function(newsletter){
					const route = '/community/newsletters/' + newsletter.id;
					return(
					 	<li> <Link to={route}> {newsletter.title} </Link></li>
					);
				});


				return(
					<div className="ac-sub">
					  <input className="ac-input" id={subtag} name={subtag} type="checkbox" />
					  <label className="ac-label" htmlFor={subtag}>{monthNames[parseInt(month)]}</label>
					  <article className="ac-sub-text">
					  	{newsletterLinks}
					  </article>
					</div>
				);
			});

			return(
		    <div className="ac">
				<input className="ac-input" id={tag} name={tag} type="checkbox" />
				<label className="ac-label" htmlFor={tag}>{year}</label>
				<article className="ac-text">
					{renderedSubsections}
		      	</article>
		    </div>
			)
		});

    return (
    	<div>
    		{renderedSections}
    	</div>
    );
  }
}

