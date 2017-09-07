import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { HashLink as Link } from 'react-router-hash-link';
import './css/ContentfulContent.css';


export default class FullTextbook extends Component {

	state ={
		textbookObjects : []
	}

	componentWillMount(){	
		//Get all chapters and subsection object
		axios.get('/api/textbook').then(res => {
				//const textbookContent = res.data.join('<br>');
				const textbookObjects = res.data;
				this.setState({textbookObjects});
			}).catch(e =>{
				console.log(e);	
			});
	}

  	render() {
  		const tableOfContents = this.state.textbookObjects.map(function(textbookObject){
  			const subsectionLinks = textbookObject.subsections.map(function(subsection){
  				return (<li><Link to={`#${subsection.id}`}>{subsection.title}</Link></li>);
  			});
  			return (
  			<li>
	  			<h3 id="textbookChapters"><Link to={`#${textbookObject.id}`}>{textbookObject.title}</Link></h3>
	  			<ul>
	  				{subsectionLinks}
	  			</ul>
  			</li>);
  		});


  		const textbookObjectsInOrder = [];

  		this.state.textbookObjects.forEach(function(textbookObject){
  			textbookObjectsInOrder.push(textbookObject);
  			textbookObject.subsections.forEach(function(subsectionObject){
  				textbookObjectsInOrder.push(subsectionObject);
  			});
  		});



  		const renderedTextbookContent = textbookObjectsInOrder.map(function(textbookObject){
 			return <div id={textbookObject.id}>{ReactHtmlParser(textbookObject.html)}</div>
  		});



	    return (
	    	<div className="textbook contentfulContainer">
	    		<div>
					<h1 id="textbookHeader"> The Crisis Text Line Textbook </h1>
	    		</div>
	    		<div>
	    			<ul>
	    				{tableOfContents}
	    			</ul>
	    		</div>
		    	<div>
		    		{renderedTextbookContent}
		      	</div>
	      	</div>
	    );
  }
}

