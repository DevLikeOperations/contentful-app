import React, { Component } from 'react';
import axios from 'axios';
import './ContentfulContent.css';


export default class TableOfContents extends Component {
	state ={
		chapters : []
	}
	componentWillMount(){
		//Get all chapters
		axios.get('/api/contents').then(res => {
					const chapters = res.data;
					this.setState({chapters});
				}).catch(e =>{
					console.log(e);	
				});

	}



	render() {
		const renderedContents = [];

		this.state.chapters.forEach(function(chapter){
			const chapterLink = <li>{chapter.title}</li>;

			renderedContents.push(chapterLink);

			chapter.subsections.forEach(function(subsection){
				const subsectionTitle = <li>{subsection.title} </li>;
				renderedContents.push(subsectionTitle);
			});

		});


		return (
			<div class="textbook contentfulContainer">
				<h2>The Textbook</h2>
				<h>Table of Contents</h>
				<ul>
					{renderedContents}
				</ul>
			</div>
		);
	}
}



